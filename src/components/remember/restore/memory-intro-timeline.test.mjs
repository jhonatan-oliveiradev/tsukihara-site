import assert from "node:assert/strict";
import test from "node:test";

async function loadTimeline() {
  try {
    return await import("./memory-intro-timeline.ts");
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND") {
      return { getMemoryIntroSchedule: undefined };
    }
    throw error;
  }
}

test("memory intro is cinematic, ordered, and unlocks interaction only after the reveal", async () => {
  const { getMemoryIntroSchedule } = await loadTimeline();
  assert.equal(typeof getMemoryIntroSchedule, "function");

  const schedule = getMemoryIntroSchedule(false);
  assert.ok(schedule.labelIn < schedule.titleIn);
  assert.ok(schedule.titleIn < schedule.jpIn);
  assert.ok(schedule.jpIn < schedule.copyOut);
  assert.ok(schedule.copyOut < schedule.surfaceIn);
  assert.ok(schedule.surfaceIn < schedule.uiIn);
  assert.ok(schedule.uiIn < schedule.complete);
  assert.ok(schedule.complete >= 2.5 && schedule.complete <= 3.1);
});

test("reduced motion preserves the intro semantics without a long cinematic hold", async () => {
  const { getMemoryIntroSchedule } = await loadTimeline();
  assert.equal(typeof getMemoryIntroSchedule, "function");

  const schedule = getMemoryIntroSchedule(true);
  assert.ok(schedule.labelIn <= schedule.titleIn);
  assert.ok(schedule.titleIn <= schedule.jpIn);
  assert.ok(schedule.jpIn < schedule.copyOut);
  assert.ok(schedule.copyOut <= schedule.surfaceIn);
  assert.ok(schedule.surfaceIn <= schedule.uiIn);
  assert.ok(schedule.uiIn <= schedule.complete);
  assert.ok(schedule.complete <= 1);
});
