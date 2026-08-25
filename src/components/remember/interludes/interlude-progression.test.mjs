import assert from "node:assert/strict";
import test from "node:test";
import { rememberReducer } from "../state/remember-reducer.ts";
import { initialRememberState } from "../state/remember-state.ts";

test("restored Mizukyo continues into Interlude I before Kurogane", () => {
  const mizukyoComplete = {
    ...initialRememberState,
    scene: "memory",
    currentStage: "mizukyo",
    activeMemoryIndex: 1,
    completedMemoryIds: ["hanamori", "mizukyo"],
    completedStages: ["hanamori", "mizukyo"],
    restorationPhase: "restored",
  };

  const next = rememberReducer(mizukyoComplete, { type: "CONTINUE" });
  assert.equal(next.scene, "interlude");
  assert.equal(next.currentStage, "interlude-01");
});

test("completed Interlude I continues into Kurogane", () => {
  const interludeComplete = {
    ...initialRememberState,
    scene: "interlude",
    currentStage: "interlude-01",
    completedMemoryIds: ["hanamori", "mizukyo"],
    completedStages: ["hanamori", "mizukyo", "interlude-01"],
  };

  const next = rememberReducer(interludeComplete, { type: "CONTINUE" });
  assert.equal(next.scene, "memory");
  assert.equal(next.currentStage, "kurogane");
  assert.equal(next.activeMemoryIndex, 2);
});
