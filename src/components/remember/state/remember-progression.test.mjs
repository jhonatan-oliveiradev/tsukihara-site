import assert from "node:assert/strict";
import test from "node:test";
import {
  REMEMBER_STAGE_ORDER,
  canReplayMemory,
  getNextStage,
  isMemoryStage,
} from "./remember-progression.ts";

test("REMEMBER prologue uses the approved deterministic stage order", () => {
  assert.deepEqual(REMEMBER_STAGE_ORDER, [
    "hanamori",
    "mizukyo",
    "interlude-01",
    "kurogane",
    "yumegakure",
    "gekkai",
    "interlude-02",
    "akari-reveal",
    "epilogue",
    "credits",
  ]);

  assert.equal(getNextStage("hanamori"), "mizukyo");
  assert.equal(getNextStage("mizukyo"), "interlude-01");
  assert.equal(getNextStage("interlude-01"), "kurogane");
  assert.equal(getNextStage("kurogane"), "yumegakure");
  assert.equal(getNextStage("yumegakure"), "gekkai");
  assert.equal(getNextStage("gekkai"), "interlude-02");
  assert.equal(getNextStage("interlude-02"), "akari-reveal");
  assert.equal(getNextStage("akari-reveal"), "epilogue");
  assert.equal(getNextStage("epilogue"), "credits");
  assert.equal(getNextStage("credits"), null);
});

test("memory-stage and replay policy distinguish narrative stages", () => {
  for (const memoryId of ["hanamori", "mizukyo", "kurogane", "yumegakure", "gekkai"]) {
    assert.equal(isMemoryStage(memoryId), true);
    assert.equal(canReplayMemory(false, memoryId), false);
    assert.equal(canReplayMemory(true, memoryId), true);
  }

  assert.equal(isMemoryStage("interlude-01"), false);
  assert.equal(isMemoryStage("akari-reveal"), false);
});
