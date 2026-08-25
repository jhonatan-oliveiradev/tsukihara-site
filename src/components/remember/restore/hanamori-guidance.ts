export const HANAMORI_FIRST_HINT_MS = 5000;
export const HANAMORI_HINT_REPEAT_MS = 8000;
export const HANAMORI_MAX_HINTS = 2;

export type HanamoriGuidanceState = {
  hintsShown: number;
  lastHintAtMs: number | null;
  learned: boolean;
};

export const createHanamoriGuidanceState = (): HanamoriGuidanceState => ({
  hintsShown: 0,
  lastHintAtMs: null,
  learned: false,
});

export const shouldShowHanamoriHint = (
  state: HanamoriGuidanceState,
  elapsedMs: number,
): boolean => {
  if (state.learned || state.hintsShown >= HANAMORI_MAX_HINTS) return false;

  if (state.lastHintAtMs === null) {
    return elapsedMs >= HANAMORI_FIRST_HINT_MS;
  }

  return elapsedMs - state.lastHintAtMs >= HANAMORI_HINT_REPEAT_MS;
};

export const recordHanamoriHint = (
  state: HanamoriGuidanceState,
  elapsedMs: number,
): HanamoriGuidanceState => {
  if (!shouldShowHanamoriHint(state, elapsedMs)) return state;

  return {
    ...state,
    hintsShown: Math.min(HANAMORI_MAX_HINTS, state.hintsShown + 1),
    lastHintAtMs: elapsedMs,
  };
};

export const markHanamoriGuidanceLearned = (
  state: HanamoriGuidanceState,
): HanamoriGuidanceState => ({
  ...state,
  learned: true,
});
