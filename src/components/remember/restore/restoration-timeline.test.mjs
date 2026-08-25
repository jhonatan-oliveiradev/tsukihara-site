import assert from "node:assert/strict";
import test from "node:test";

async function loadTimeline() {
  try {
    return await import("./restoration-timeline.ts");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_MODULE_NOT_FOUND"
    ) {
      return { getRestorationSchedule: undefined };
    }
    throw error;
  }
}

test("restoration phases stay ordered and end restored", async () => {
  const { getRestorationSchedule } = await loadTimeline();
  assert.equal(typeof getRestorationSchedule, "function", "getRestorationSchedule must exist");

  const schedule = getRestorationSchedule(false);
  assert.deepEqual(
    schedule.map((beat) => beat.phase),
    ["last-piece", "kintsugi", "pulse", "restoring", "revealing", "restored"],
  );
  assert.ok(schedule.every((beat, index) => index === 0 || beat.at > schedule[index - 1].at));
  assert.equal(schedule.at(-1).at, 2.8);
});

test("reduced motion finishes faster without changing phase semantics", async () => {
  const { getRestorationSchedule } = await loadTimeline();
  assert.equal(typeof getRestorationSchedule, "function", "getRestorationSchedule must exist");

  const normal = getRestorationSchedule(false);
  const reduced = getRestorationSchedule(true);

  assert.deepEqual(
    reduced.map((beat) => beat.phase),
    normal.map((beat) => beat.phase),
  );
  assert.ok(reduced.at(-1).at < normal.at(-1).at);
  assert.equal(reduced.at(-1).at, 1.4);
});
