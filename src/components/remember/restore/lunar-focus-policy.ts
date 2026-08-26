import type { RealityState } from "../content/memory-definitions.ts";

export type LunarFocusState =
  | { status: "ready" }
  | { status: "active"; remainingMs: number }
  | { status: "cooldown"; remainingMs: number };

export type RealityCycleState = {
  reality: RealityState;
  elapsedMs: number;
};

export const LUNAR_FOCUS_ACTIVE_MS = 3000;
export const LUNAR_FOCUS_COOLDOWN_MS = 6000;
export const REALITY_CYCLE_MS = 2600;
export const REALITY_REDUCED_CYCLE_MS = 4200;

const sanitizeDelta = (elapsedMs: number) =>
  Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;

export const activateLunarFocus = (state: LunarFocusState): LunarFocusState =>
  state.status === "ready" ? { status: "active", remainingMs: LUNAR_FOCUS_ACTIVE_MS } : state;

export const tickLunarFocus = (
  state: LunarFocusState,
  elapsedMs: number,
  paused: boolean,
): LunarFocusState => {
  let delta = sanitizeDelta(elapsedMs);
  if (paused || delta === 0 || state.status === "ready") return state;

  let current = state;

  while (delta > 0 && current.status !== "ready") {
    if (delta < current.remainingMs) {
      return { ...current, remainingMs: current.remainingMs - delta };
    }

    delta -= current.remainingMs;
    current =
      current.status === "active"
        ? { status: "cooldown", remainingMs: LUNAR_FOCUS_COOLDOWN_MS }
        : { status: "ready" };
  }

  return current;
};

export const isRealitySnapAllowed = (
  stableReality: RealityState,
  currentReality: RealityState,
  focusState: LunarFocusState,
) => focusState.status === "active" || stableReality === currentReality;

export const tickRealityCycle = (
  state: RealityCycleState,
  elapsedMs: number,
  paused: boolean,
  focusActive: boolean,
  cycleMs = REALITY_CYCLE_MS,
): RealityCycleState => {
  const delta = sanitizeDelta(elapsedMs);
  const safeCycleMs = Math.max(1, cycleMs);
  if (paused || focusActive || delta === 0) return state;

  const total = state.elapsedMs + delta;
  const flips = Math.floor(total / safeCycleMs);
  const reality = flips % 2 === 0 ? state.reality : state.reality === "a" ? "b" : "a";

  return {
    reality,
    elapsedMs: total % safeCycleMs,
  };
};
