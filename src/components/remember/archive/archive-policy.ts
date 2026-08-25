import type { RememberSaveV1 } from "../state/remember-save.ts";
import type { MemoryId, RememberStageId } from "../state/remember-state.ts";

export type TitleMenuPrimaryAction = "new-game" | "continue" | "revisit";

export type TitleMenuPolicy = {
  primary: TitleMenuPrimaryAction;
  showNewGame: boolean;
  stage: RememberStageId | null;
};

export type ArchiveRecordState = "RESTORED" | "UNSTABLE" | "UNKNOWN" | "LOCKED";

export const getTitleMenuPolicy = (save: RememberSaveV1 | null): TitleMenuPolicy => {
  if (!save) {
    return { primary: "new-game", showNewGame: false, stage: null };
  }

  if (save.gameCompleted) {
    return { primary: "revisit", showNewGame: true, stage: null };
  }

  return { primary: "continue", showNewGame: true, stage: save.currentStage };
};

export const deriveArchiveProgress = (completed: MemoryId[]) =>
  Math.min(100, new Set(completed).size * 20);

export const getArchiveRecordState = ({
  memoryId,
  completedMemoryIds,
  currentStage,
}: {
  memoryId: MemoryId;
  completedMemoryIds: MemoryId[];
  currentStage: RememberStageId;
}): ArchiveRecordState => {
  if (completedMemoryIds.includes(memoryId)) return "RESTORED";
  if (currentStage === memoryId) return "UNSTABLE";
  return "UNKNOWN";
};

export const canOpenArchiveRecord = (gameCompleted: boolean, state: ArchiveRecordState) =>
  gameCompleted && state === "RESTORED";

export const getAkariArchiveRecordState = (discoveredAkariRecord: boolean): ArchiveRecordState =>
  discoveredAkariRecord ? "RESTORED" : "LOCKED";
