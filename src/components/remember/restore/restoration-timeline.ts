import type { RestorationPhase } from "@/components/remember/state/remember-state";

export type RestorationBeat = {
  phase: Exclude<RestorationPhase, "idle">;
  at: number;
};

export const RESTORATION_PHASES: RestorationBeat["phase"][] = [
  "last-piece",
  "kintsugi",
  "pulse",
  "restoring",
  "revealing",
  "restored",
];

const NORMAL_TIMINGS = [0, 0.15, 0.9, 1, 1.5, 2.8] as const;
const REDUCED_TIMINGS = [0, 0.08, 0.18, 0.3, 0.55, 1.4] as const;

export function getRestorationSchedule(reducedMotion: boolean): RestorationBeat[] {
  const timings = reducedMotion ? REDUCED_TIMINGS : NORMAL_TIMINGS;
  return RESTORATION_PHASES.map((phase, index) => ({ phase, at: timings[index] }));
}
