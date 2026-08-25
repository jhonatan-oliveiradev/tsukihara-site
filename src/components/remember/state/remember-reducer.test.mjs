import assert from "node:assert/strict";
import test from "node:test";
import { rememberReducer } from "./remember-reducer.ts";
import { initialRememberState } from "./remember-state.ts";

test("REMEMBER starts at entry and ENTER advances to restore", () => {
  assert.equal(initialRememberState.scene, "entry");
  const next = rememberReducer(initialRememberState, { type: "ENTER" });
  assert.equal(next.scene, "restore");
});

test("fragment restoration is idempotent and completes on five unique fragments", () => {
  let state = rememberReducer(initialRememberState, { type: "ENTER" });

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
  assert.equal(duplicate.scene, "restore");

  for (const fragmentId of ["fragment-b", "fragment-c", "fragment-d", "fragment-e"]) {
    state = rememberReducer(state, { type: "RESTORE_FRAGMENT", fragmentId, totalFragments: 5 });
  }

  assert.equal(state.restoredFragmentIds.length, 5);
  assert.equal(state.scene, "memory-reveal");
});

test("mute survives scene transitions", () => {
  let state = rememberReducer(initialRememberState, { type: "SET_MUTED", muted: true });
  state = rememberReducer(state, { type: "ENTER" });
  state = rememberReducer(state, {
    type: "RESTORE_FRAGMENT",
    fragmentId: "fragment-a",
    totalFragments: 5,
  });
  assert.equal(state.muted, true);
});

test("RESTART returns to a clean entry state", () => {
  let state = rememberReducer(initialRememberState, { type: "ENTER" });
  state = rememberReducer(state, {
    type: "RESTORE_FRAGMENT",
    fragmentId: "fragment-a",
    totalFragments: 5,
  });
  state = rememberReducer(state, { type: "SET_MUTED", muted: true });

  const restarted = rememberReducer(state, { type: "RESTART" });
  assert.deepEqual(restarted, initialRememberState);
});
