import type { MemoryId, RememberStageId } from "./remember-state.ts";

export const REMEMBER_STAGE_ORDER: RememberStageId[] = [
  "hanamori",
  "mizukyo",
  "interlude-01",
  "kurogane",
  "yumegakure",
  "gekkai",
  "interlude-02",
  "akari-reveal",
  "epilogue",
  "credits",
];

const MEMORY_STAGE_IDS = new Set<MemoryId>([
  "hanamori",
  "mizukyo",
  "kurogane",
  "yumegakure",
  "gekkai",
]);

export const getNextStage = (stage: RememberStageId): RememberStageId | null => {
  const index = REMEMBER_STAGE_ORDER.indexOf(stage);
  if (index < 0) return null;
  return REMEMBER_STAGE_ORDER[index + 1] ?? null;
};

export const isMemoryStage = (stage: RememberStageId): stage is MemoryId =>
  MEMORY_STAGE_IDS.has(stage as MemoryId);

export const canReplayMemory = (gameCompleted: boolean, memoryId: MemoryId) =>
  gameCompleted && MEMORY_STAGE_IDS.has(memoryId);
