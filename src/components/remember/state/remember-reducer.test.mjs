import assert from "node:assert/strict";
import test from "node:test";
import { rememberReducer } from "./remember-reducer.ts";
import { initialRememberState } from "./remember-state.ts";

test("REMEMBER starts at boot and unlock enters menu without starting gameplay", () => {
  assert.equal(initialRememberState.scene, "boot");
  const next = rememberReducer(initialRememberState, { type: "UNLOCK_MENU" });
  assert.equal(next.scene, "menu");
  assert.equal(next.activeMemoryIndex, 0);
});

test("BEGIN_GAME enters memory 01 with clean restoration state", () => {
  const menu = rememberReducer(initialRememberState, { type: "UNLOCK_MENU" });
  const next = rememberReducer(menu, { type: "BEGIN_GAME" });

  assert.equal(next.scene, "memory");
  assert.equal(next.activeMemoryIndex, 0);
  assert.deepEqual(next.restoredFragmentIds, []);
  assert.equal(next.restorationPhase, "idle");
});

test("fragment restoration is idempotent and the final unique fragment starts the climax", () => {
  let state = rememberReducer(
    rememberReducer(initialRememberState, { type: "UNLOCK_MENU" }),
    { type: "BEGIN_GAME" },
  );

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

  for (const fragmentId of ["fragment-b", "fragment-c", "fragment-d", "fragment-e"]) {
    state = rememberReducer(state, { type: "RESTORE_FRAGMENT", fragmentId, totalFragments: 5 });
  }

  assert.equal(state.scene, "memory");
  assert.equal(state.restoredFragmentIds.length, 5);
  assert.equal(state.restorationPhase, "last-piece");
});

test("CONTINUE does not advance a memory before restoration is stable", () => {
  const playing = rememberReducer(
    rememberReducer(initialRememberState, { type: "UNLOCK_MENU" }),
    { type: "BEGIN_GAME" },
  );
  const attempted = rememberReducer(playing, { type: "CONTINUE" });
  assert.deepEqual(attempted, playing);
});

test("three restored memories advance Hanamori to Mizukyo to Kurogane to Akari", () => {
  let state = rememberReducer(
    rememberReducer(initialRememberState, { type: "UNLOCK_MENU" }),
    { type: "BEGIN_GAME" },
  );

  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "hanamori" });
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "memory");
  assert.equal(state.activeMemoryIndex, 1);
  assert.deepEqual(state.completedMemoryIds, ["hanamori"]);
  assert.deepEqual(state.restoredFragmentIds, []);
  assert.equal(state.restorationPhase, "idle");

  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "mizukyo" });
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.activeMemoryIndex, 2);
  assert.deepEqual(state.completedMemoryIds, ["hanamori", "mizukyo"]);

  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "kurogane" });
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "akari-reveal");
  assert.deepEqual(state.completedMemoryIds, ["hanamori", "mizukyo", "kurogane"]);
});

test("marking a restored memory twice is idempotent", () => {
  const playing = rememberReducer(
    rememberReducer(initialRememberState, { type: "UNLOCK_MENU" }),
    { type: "BEGIN_GAME" },
  );
  const restored = rememberReducer(playing, {
    type: "MARK_MEMORY_RESTORED",
    memoryId: "hanamori",
  });
  const duplicate = rememberReducer(restored, {
    type: "MARK_MEMORY_RESTORED",
    memoryId: "hanamori",
  });

  assert.deepEqual(duplicate.completedMemoryIds, ["hanamori"]);
  assert.equal(duplicate.restorationPhase, "restored");
});

test("locale and mute survive scene and memory transitions", () => {
  let state = rememberReducer(initialRememberState, { type: "SET_LOCALE", locale: "en" });
  state = rememberReducer(state, { type: "SET_MUTED", muted: true });
  state = rememberReducer(state, { type: "UNLOCK_MENU" });
  state = rememberReducer(state, { type: "BEGIN_GAME" });
  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "hanamori" });
  state = rememberReducer(state, { type: "CONTINUE" });

  assert.equal(state.locale, "en");
  assert.equal(state.muted, true);
  assert.equal(state.activeMemoryIndex, 1);
});

test("final narrative progresses Akari to epilogue to credits", () => {
  let state = { ...initialRememberState, scene: "akari-reveal" };
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "epilogue");
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "credits");
});

test("RESTART clears narrative progress while preserving locale and mute preference", () => {
  let state = rememberReducer(initialRememberState, { type: "SET_LOCALE", locale: "en" });
  state = rememberReducer(state, { type: "SET_MUTED", muted: true });
  state = rememberReducer(state, { type: "UNLOCK_MENU" });
  state = rememberReducer(state, { type: "BEGIN_GAME" });
  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "hanamori" });

  const restarted = rememberReducer(state, { type: "RESTART" });
  assert.equal(restarted.scene, "boot");
  assert.equal(restarted.locale, "en");
  assert.equal(restarted.muted, true);
  assert.equal(restarted.activeMemoryIndex, 0);
  assert.deepEqual(restarted.completedMemoryIds, []);
  assert.deepEqual(restarted.restoredFragmentIds, []);
  assert.equal(restarted.restorationPhase, "idle");
});
