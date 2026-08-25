import assert from "node:assert/strict";
import test from "node:test";

async function loadPolicy() {
  try {
    return await import("./scene-transition-policy.ts");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_MODULE_NOT_FOUND"
    ) {
      return {};
    }
    throw error;
  }
}

test("scene transitions accept requests only while idle", async () => {
  const { canRequestTransition } = await loadPolicy();
  assert.equal(typeof canRequestTransition, "function");
  assert.equal(canRequestTransition("idle"), true);
  assert.equal(canRequestTransition("exiting"), false);
  assert.equal(canRequestTransition("covered"), false);
  assert.equal(canRequestTransition("entering"), false);
});

test("destination commits only while the veil fully covers the stage", async () => {
  const { canCommitDestination } = await loadPolicy();
  assert.equal(typeof canCommitDestination, "function");
  assert.equal(canCommitDestination("covered"), true);
  assert.equal(canCommitDestination("idle"), false);
  assert.equal(canCommitDestination("exiting"), false);
  assert.equal(canCommitDestination("entering"), false);
});

test("reduced motion keeps the same transition locking with shorter timings", async () => {
  const { getSceneTransitionTimings } = await loadPolicy();
  assert.equal(typeof getSceneTransitionTimings, "function");

  const normal = getSceneTransitionTimings(false);
  const reduced = getSceneTransitionTimings(true);

  assert.ok(normal.exitMs >= 350 && normal.exitMs <= 500);
  assert.ok(normal.enterMs >= 600 && normal.enterMs <= 800);
  assert.ok(reduced.exitMs < normal.exitMs);
  assert.ok(reduced.enterMs < normal.enterMs);
  assert.ok(reduced.exitMs > 0);
  assert.ok(reduced.enterMs > 0);
});
