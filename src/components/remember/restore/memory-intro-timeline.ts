export type MemoryIntroSchedule = {
  labelIn: number;
  titleIn: number;
  jpIn: number;
  copyOut: number;
  surfaceIn: number;
  uiIn: number;
  complete: number;
};

const CINEMATIC_INTRO: MemoryIntroSchedule = {
  labelIn: 0.18,
  titleIn: 0.42,
  jpIn: 0.68,
  copyOut: 1.58,
  surfaceIn: 1.92,
  uiIn: 2.25,
  complete: 2.85,
};

const REDUCED_MOTION_INTRO: MemoryIntroSchedule = {
  labelIn: 0,
  titleIn: 0.05,
  jpIn: 0.1,
  copyOut: 0.28,
  surfaceIn: 0.38,
  uiIn: 0.55,
  complete: 0.82,
};

export function getMemoryIntroSchedule(reducedMotion: boolean): MemoryIntroSchedule {
  return reducedMotion ? REDUCED_MOTION_INTRO : CINEMATIC_INTRO;
}
