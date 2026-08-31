import type { MemoryProgress, MemoryResult, ResonanceRank } from "../state/remember-save.ts";

type IntegrityInput = {
  mistakes: number;
  falseFragments: number;
  completionTime: number;
  parSeconds: number;
};

type CreateMemoryResultInput = {
  progress: MemoryProgress;
  completionTime: number;
  parSeconds: number;
  completedAt: string;
};

const finiteNonNegative = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);

export const calculateIntegrity = ({
  mistakes,
  falseFragments,
  completionTime,
  parSeconds,
}: IntegrityInput) => {
  const safeMistakes = finiteNonNegative(mistakes);
  const safeFalseFragments = finiteNonNegative(falseFragments);
  const safeCompletionTime = finiteNonNegative(completionTime);
  const safeParSeconds = finiteNonNegative(parSeconds);
  const overtimeSeconds = Math.max(0, safeCompletionTime - safeParSeconds);
  const overtimePenalty = Math.floor(overtimeSeconds / 30) * 2;
  const integrity = 100 - safeMistakes * 3 - safeFalseFragments * 8 - overtimePenalty;

  return Math.max(0, Math.min(100, integrity));
};

export const resonanceForIntegrity = (integrity: number): ResonanceRank => {
  const safeIntegrity = Math.max(0, Math.min(100, finiteNonNegative(integrity)));
  if (safeIntegrity >= 95) return "S";
  if (safeIntegrity >= 85) return "A";
  if (safeIntegrity >= 70) return "B";
  return "C";
};

export const createMemoryResult = ({
  progress,
  completionTime,
  parSeconds,
  completedAt,
}: CreateMemoryResultInput): MemoryResult => {
  const safeCompletionTime = finiteNonNegative(completionTime);
  const integrity = calculateIntegrity({
    mistakes: progress.mistakes,
    falseFragments: progress.falseFragments,
    completionTime: safeCompletionTime,
    parSeconds,
  });

  return {
    completed: true,
    completedAt,
    completionTime: safeCompletionTime,
    mistakes: finiteNonNegative(progress.mistakes),
    falseFragments: finiteNonNegative(progress.falseFragments),
    integrity,
    resonance: resonanceForIntegrity(integrity),
  };
};

export const chooseBestMemoryResult = (
  current: MemoryResult | null | undefined,
  candidate: MemoryResult,
): MemoryResult => {
  if (!current) return candidate;

  if (candidate.integrity !== current.integrity) {
    return candidate.integrity > current.integrity ? candidate : current;
  }

  if (candidate.completionTime !== current.completionTime) {
    return candidate.completionTime < current.completionTime ? candidate : current;
  }

  if (candidate.mistakes !== current.mistakes) {
    return candidate.mistakes < current.mistakes ? candidate : current;
  }

  return current;
};
