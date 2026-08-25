import type { MemoryId, RememberStageId } from "./remember-state.ts";

export const REMEMBER_SAVE_KEY = "tsukihara:remember:save:v1";

export type ResonanceRank = "S" | "A" | "B" | "C";

export type MemoryProgress = {
  restoredFragmentIds: string[];
  startedAt?: string;
  elapsedMs: number;
  mistakes: number;
  falseFragments: number;
};

export type MemoryResult = {
  completed: true;
  completedAt: string;
  completionTime: number;
  mistakes: number;
  falseFragments: number;
  integrity: number;
  resonance: ResonanceRank;
};

export type RememberSaveV1 = {
  version: 1;
  startedAt: string;
  updatedAt: string;
  currentStage: RememberStageId;
  completedStages: RememberStageId[];
  memoryProgress: Partial<Record<MemoryId, MemoryProgress>>;
  memories: Partial<Record<MemoryId, MemoryResult>>;
  discoveredAkariRecord: boolean;
  gameCompleted: boolean;
};

const memoryOrder: MemoryId[] = ["hanamori", "mizukyo", "kurogane", "yumegakure", "gekkai"];
const prematureFinaleStages = new Set<RememberStageId>(["akari-reveal", "epilogue", "credits"]);

const stageIds = new Set<RememberStageId>([
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
]);

const memoryIds = new Set<MemoryId>(memoryOrder);
const resonanceRanks = new Set<ResonanceRank>(["S", "A", "B", "C"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonNegativeFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const hasOnlyKnownKeys = (record: Record<string, unknown>, keys: Set<string>) =>
  Object.keys(record).every((key) => keys.has(key));

const isStageId = (value: unknown): value is RememberStageId =>
  typeof value === "string" && stageIds.has(value as RememberStageId);

const isMemoryProgress = (value: unknown): value is MemoryProgress => {
  if (!isRecord(value)) return false;
  if (!isStringArray(value.restoredFragmentIds)) return false;
  if (value.startedAt !== undefined && typeof value.startedAt !== "string") return false;
  return (
    isNonNegativeFinite(value.elapsedMs) &&
    isNonNegativeFinite(value.mistakes) &&
    isNonNegativeFinite(value.falseFragments)
  );
};

const isMemoryResult = (value: unknown): value is MemoryResult => {
  if (!isRecord(value) || value.completed !== true) return false;
  return (
    typeof value.completedAt === "string" &&
    isNonNegativeFinite(value.completionTime) &&
    isNonNegativeFinite(value.mistakes) &&
    isNonNegativeFinite(value.falseFragments) &&
    isNonNegativeFinite(value.integrity) &&
    value.integrity <= 100 &&
    typeof value.resonance === "string" &&
    resonanceRanks.has(value.resonance as ResonanceRank)
  );
};

const isMemoryProgressRecord = (
  value: unknown,
): value is Partial<Record<MemoryId, MemoryProgress>> => {
  if (!isRecord(value) || !hasOnlyKnownKeys(value, memoryIds as Set<string>)) return false;
  return Object.values(value).every(isMemoryProgress);
};

const isMemoryResultRecord = (value: unknown): value is Partial<Record<MemoryId, MemoryResult>> => {
  if (!isRecord(value) || !hasOnlyKnownKeys(value, memoryIds as Set<string>)) return false;
  return Object.values(value).every(isMemoryResult);
};

const repairPrematureFinaleStage = (
  currentStage: RememberStageId,
  completedStages: RememberStageId[],
  memories: Partial<Record<MemoryId, MemoryResult>>,
  gameCompleted: boolean,
): RememberStageId => {
  if (gameCompleted || !prematureFinaleStages.has(currentStage)) return currentStage;

  const firstIncompleteMemory = memoryOrder.find(
    (memoryId) =>
      !completedStages.includes(memoryId) && memories[memoryId]?.completed !== true,
  );

  return firstIncompleteMemory ?? currentStage;
};

const normalizeV1 = (value: unknown): RememberSaveV1 | null => {
  if (!isRecord(value) || value.version !== 1) return null;
  if (typeof value.startedAt !== "string" || typeof value.updatedAt !== "string") return null;
  if (!isStageId(value.currentStage)) return null;
  if (!Array.isArray(value.completedStages) || !value.completedStages.every(isStageId)) return null;
  if (!isMemoryProgressRecord(value.memoryProgress)) return null;
  if (!isMemoryResultRecord(value.memories)) return null;
  if (typeof value.discoveredAkariRecord !== "boolean") return null;
  if (typeof value.gameCompleted !== "boolean") return null;

  const completedStages = [...new Set(value.completedStages)];
  const currentStage = repairPrematureFinaleStage(
    value.currentStage,
    completedStages,
    value.memories,
    value.gameCompleted,
  );

  return {
    version: 1,
    startedAt: value.startedAt,
    updatedAt: value.updatedAt,
    currentStage,
    completedStages,
    memoryProgress: value.memoryProgress,
    memories: value.memories,
    discoveredAkariRecord: value.discoveredAkariRecord,
    gameCompleted: value.gameCompleted,
  };
};

export const migrateRememberSave = (value: unknown): RememberSaveV1 | null => {
  if (!isRecord(value) || value.version !== 1) return null;
  return normalizeV1(value);
};

export const createNewRememberSave = (now: string): RememberSaveV1 => ({
  version: 1,
  startedAt: now,
  updatedAt: now,
  currentStage: "hanamori",
  completedStages: [],
  memoryProgress: {},
  memories: {},
  discoveredAkariRecord: false,
  gameCompleted: false,
});

export const serializeRememberSave = (save: RememberSaveV1) => JSON.stringify(save);

export const loadRememberSave = (raw: string | null): RememberSaveV1 | null => {
  if (!raw) return null;
  try {
    return migrateRememberSave(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
};
