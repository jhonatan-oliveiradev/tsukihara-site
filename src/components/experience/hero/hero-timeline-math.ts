export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const rangeProgress = (progress: number, start: number, end: number) => {
  if (end <= start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
};

export const smoothRange = (progress: number, start: number, end: number) => {
  const value = rangeProgress(progress, start, end);
  return value * value * (3 - 2 * value);
};

export type HeroPhaseWeights = {
  serenity: number;
  omen: number;
  eclipse: number;
  awakening: number;
  crimson: number;
  resolve: number;
};

export const phaseWeights = (progress: number): HeroPhaseWeights => ({
  serenity: rangeProgress(progress, 0, 0.12),
  omen: rangeProgress(progress, 0.12, 0.28),
  eclipse: rangeProgress(progress, 0.28, 0.48),
  awakening: rangeProgress(progress, 0.48, 0.68),
  crimson: rangeProgress(progress, 0.68, 0.86),
  resolve: rangeProgress(progress, 0.86, 1),
});
