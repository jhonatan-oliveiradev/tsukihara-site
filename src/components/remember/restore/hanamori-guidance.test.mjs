import assert from "node:assert/strict";
import test from "node:test";
import {
  HANAMORI_FIRST_HINT_MS,
  HANAMORI_HINT_REPEAT_MS,
  HANAMORI_MAX_HINTS,
  createHanamoriGuidanceState,
  markHanamoriGuidanceLearned,
  recordHanamoriHint,
  shouldShowHanamoriHint,
} from "./hanamori-guidance.ts";

test("Hanamori waits five seconds before its first idle hint", () => {
  const state = createHanamoriGuidanceState();

  assert.equal(shouldShowHanamoriHint(state, HANAMORI_FIRST_HINT_MS - 1), false);
  assert.equal(shouldShowHanamoriHint(state, HANAMORI_FIRST_HINT_MS), true);
});

test("Hanamori repeats hints at most twice and never sooner than eight seconds", () => {
  let state = createHanamoriGuidanceState();
  state = recordHanamoriHint(state, HANAMORI_FIRST_HINT_MS);

  assert.equal(state.hintsShown, 1);
  assert.equal(
    shouldShowHanamoriHint(state, HANAMORI_FIRST_HINT_MS + HANAMORI_HINT_REPEAT_MS - 1),
    false,
  );
  assert.equal(
    shouldShowHanamoriHint(state, HANAMORI_FIRST_HINT_MS + HANAMORI_HINT_REPEAT_MS),
    true,
  );

  state = recordHanamoriHint(state, HANAMORI_FIRST_HINT_MS + HANAMORI_HINT_REPEAT_MS);
  assert.equal(state.hintsShown, HANAMORI_MAX_HINTS);
  assert.equal(shouldShowHanamoriHint(state, 99_999), false);
});

test("first successful snap permanently ends onboarding for the active run", () => {
  const learned = markHanamoriGuidanceLearned(createHanamoriGuidanceState());

  assert.equal(learned.learned, true);
  assert.equal(shouldShowHanamoriHint(learned, 99_999), false);
});
