import assert from "node:assert/strict";
import test from "node:test";

const loadPolicy = async () => {
  try {
    return await import("./lunar-focus-policy.ts");
  } catch (error) {
    assert.fail(`Lunar Focus policy is missing: ${String(error)}`);
  }
};

test("Lunar Focus runs 3s active, 6s cooldown, and freezes while paused", async () => {
  const policy = await loadPolicy();

  assert.equal(policy.LUNAR_FOCUS_ACTIVE_MS, 3000);
  assert.equal(policy.LUNAR_FOCUS_COOLDOWN_MS, 6000);

  const active = policy.activateLunarFocus({ status: "ready" });
  assert.deepEqual(active, { status: "active", remainingMs: 3000 });
  assert.deepEqual(policy.activateLunarFocus(active), active);

  const partiallyActive = policy.tickLunarFocus(active, 1250, false);
  assert.deepEqual(partiallyActive, { status: "active", remainingMs: 1750 });
  assert.deepEqual(policy.tickLunarFocus(partiallyActive, 900, true), partiallyActive);

  const cooldown = policy.tickLunarFocus(partiallyActive, 1750, false);
  assert.deepEqual(cooldown, { status: "cooldown", remainingMs: 6000 });
  assert.deepEqual(policy.activateLunarFocus(cooldown), cooldown);

  const partiallyCooled = policy.tickLunarFocus(cooldown, 2500, false);
  assert.deepEqual(partiallyCooled, { status: "cooldown", remainingMs: 3500 });
  assert.deepEqual(policy.tickLunarFocus(partiallyCooled, 800, true), partiallyCooled);
  assert.deepEqual(policy.tickLunarFocus(partiallyCooled, 3500, false), { status: "ready" });
});

test("Lunar Focus carries overshoot through active and cooldown phases", async () => {
  const policy = await loadPolicy();
  const active = policy.activateLunarFocus({ status: "ready" });

  assert.deepEqual(policy.tickLunarFocus(active, 3500, false), {
    status: "cooldown",
    remainingMs: 5500,
  });
  assert.deepEqual(policy.tickLunarFocus(active, 9000, false), { status: "ready" });
});

test("Gekkai only accepts authentic-reality snaps unless Lunar Focus is active", async () => {
  const policy = await loadPolicy();
  const ready = { status: "ready" };
  const focused = policy.activateLunarFocus(ready);

  assert.equal(policy.isRealitySnapAllowed("a", "a", ready), true);
  assert.equal(policy.isRealitySnapAllowed("a", "b", ready), false);
  assert.equal(policy.isRealitySnapAllowed("b", "a", ready), false);
  assert.equal(policy.isRealitySnapAllowed("b", "b", ready), true);
  assert.equal(policy.isRealitySnapAllowed("a", "b", focused), true);
  assert.equal(policy.isRealitySnapAllowed("b", "a", focused), true);
});

test("Gekkai reality oscillation freezes during Focus and pause", async () => {
  const policy = await loadPolicy();
  const initial = { reality: "a", elapsedMs: 0 };

  assert.deepEqual(policy.tickRealityCycle(initial, policy.REALITY_CYCLE_MS - 1, false, false), {
    reality: "a",
    elapsedMs: policy.REALITY_CYCLE_MS - 1,
  });
  assert.deepEqual(policy.tickRealityCycle(initial, 1000, true, false), initial);
  assert.deepEqual(policy.tickRealityCycle(initial, 1000, false, true), initial);
  assert.deepEqual(policy.tickRealityCycle(initial, policy.REALITY_CYCLE_MS, false, false), {
    reality: "b",
    elapsedMs: 0,
  });
});
