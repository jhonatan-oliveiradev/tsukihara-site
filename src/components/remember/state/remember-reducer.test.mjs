import assert from "node:assert/strict";
import test from "node:test";
import { rememberReducer } from "./remember-reducer.ts";
import { initialRememberState } from "./remember-state.ts";
import { createNewRememberSave } from "./remember-save.ts";

test("REMEMBER starts at boot with Hanamori as the logical first stage", () => {
  assert.equal(initialRememberState.scene, "boot");
  assert.equal(initialRememberState.currentStage, "hanamori");
  assert.equal(initialRememberState.paused, false);
  assert.equal(initialRememberState.archiveOpen, false);
});

test("boot unlock enters menu without starting gameplay", () => {
  const next = rememberReducer(initialRememberState, { type: "UNLOCK_MENU" });
  assert.equal(next.scene, "menu");
  assert.equal(next.currentStage, "hanamori");
});

test("START_NEW_GAME resets progression but preserves locale and mute", () => {
  let state = rememberReducer(initialRememberState, { type: "SET_LOCALE", locale: "en" });
  state = rememberReducer(state, { type: "SET_MUTED", muted: true });
  state = {
    ...state,
    completedStages: ["hanamori", "mizukyo"],
    completedMemoryIds: ["hanamori", "mizukyo"],
  };

  const next = rememberReducer(state, { type: "START_NEW_GAME" });
  assert.equal(next.scene, "memory");
  assert.equal(next.currentStage, "hanamori");
  assert.deepEqual(next.completedStages, []);
  assert.deepEqual(next.completedMemoryIds, []);
  assert.equal(next.locale, "en");
  assert.equal(next.muted, true);
});

test("pause and archive are orthogonal to narrative progression", () => {
  let state = { ...initialRememberState, scene: "memory" };
  state = rememberReducer(state, { type: "OPEN_PAUSE" });
  assert.equal(state.paused, true);
  assert.equal(state.currentStage, "hanamori");

  state = rememberReducer(state, { type: "OPEN_ARCHIVE" });
  assert.equal(state.archiveOpen, true);
  assert.equal(state.currentStage, "hanamori");

  state = rememberReducer(state, { type: "CLOSE_ARCHIVE" });
  state = rememberReducer(state, { type: "CLOSE_PAUSE" });
  assert.equal(state.archiveOpen, false);
  assert.equal(state.paused, false);
});

test("ENTER_STAGE changes the logical stage and resets puzzle runtime", () => {
  const playing = {
    ...initialRememberState,
    scene: "memory",
    restoredFragmentIds: ["fragment-a"],
    restorationPhase: "kintsugi",
  };

  const next = rememberReducer(playing, { type: "ENTER_STAGE", stage: "yumegakure" });
  assert.equal(next.scene, "memory");
  assert.equal(next.currentStage, "yumegakure");
  assert.equal(next.activeMemoryIndex, 3);
  assert.deepEqual(next.restoredFragmentIds, []);
  assert.equal(next.restorationPhase, "idle");
});

test("COMPLETE_STAGE records completion without automatically skipping the next transition", () => {
  const state = { ...initialRememberState, scene: "memory" };
  const next = rememberReducer(state, { type: "COMPLETE_STAGE", stage: "hanamori" });
  assert.deepEqual(next.completedStages, ["hanamori"]);
  assert.deepEqual(next.completedMemoryIds, ["hanamori"]);
  assert.equal(next.currentStage, "hanamori");
});

test("HYDRATE_SAVE restores durable progress without opening pause or archive", () => {
  const save = {
    ...createNewRememberSave("2026-08-25T16:00:00.000Z"),
    currentStage: "kurogane",
    completedStages: ["hanamori", "mizukyo", "interlude-01"],
    memories: {
      hanamori: {
        completed: true,
        completedAt: "2026-08-25T16:02:00.000Z",
        completionTime: 120,
        mistakes: 0,
        falseFragments: 0,
        integrity: 96,
        resonance: "S",
      },
      mizukyo: {
        completed: true,
        completedAt: "2026-08-25T16:05:00.000Z",
        completionTime: 150,
        mistakes: 1,
        falseFragments: 0,
        integrity: 91,
        resonance: "A",
      },
    },
  };

  const next = rememberReducer(initialRememberState, { type: "HYDRATE_SAVE", save });
  assert.equal(next.currentStage, "kurogane");
  assert.deepEqual(next.completedStages, save.completedStages);
  assert.deepEqual(next.completedMemoryIds, ["hanamori", "mizukyo"]);
  assert.equal(next.paused, false);
  assert.equal(next.archiveOpen, false);
});

test("legacy fragment restoration remains idempotent for the existing puzzles", () => {
  let state = rememberReducer(rememberReducer(initialRememberState, { type: "UNLOCK_MENU" }), {
    type: "BEGIN_GAME",
  });

  state = rememberReducer(state, {
    type: "RESTORE_FRAGMENT",
    fragmentId: "fragment-a",
    totalFragments: 5,
  });
  const duplicate = rememberReducer(state, {
    type: "RESTORE_FRAGMENT",
    fragmentId: "fragment-a",
    totalFragments: 5,
  });

  assert.deepEqual(duplicate.restoredFragmentIds, ["fragment-a"]);
  assert.equal(duplicate.restorationPhase, "idle");
});

test("RESTART clears runtime progress while preserving locale and mute preference", () => {
  let state = rememberReducer(initialRememberState, { type: "SET_LOCALE", locale: "en" });
  state = rememberReducer(state, { type: "SET_MUTED", muted: true });
  state = { ...state, paused: true, archiveOpen: true, currentStage: "gekkai" };

  const restarted = rememberReducer(state, { type: "RESTART" });
  assert.equal(restarted.scene, "boot");
  assert.equal(restarted.currentStage, "hanamori");
  assert.equal(restarted.locale, "en");
  assert.equal(restarted.muted, true);
  assert.equal(restarted.paused, false);
  assert.equal(restarted.archiveOpen, false);
});
