import type { RememberSaveV1 } from "./remember-save.ts";

export type RememberScene =
  "boot" | "menu" | "memory" | "interlude" | "akari-reveal" | "epilogue" | "credits";

export type RememberLocale = "pt" | "en";

export type MemoryId = "hanamori" | "mizukyo" | "kurogane" | "yumegakure" | "gekkai";

export type RememberStageId =
  | "hanamori"
  | "mizukyo"
  | "interlude-01"
  | "kurogane"
  | "yumegakure"
  | "gekkai"
  | "interlude-02"
  | "akari-reveal"
  | "epilogue"
  | "credits";

export type RestorationPhase =
  "idle" | "last-piece" | "kintsugi" | "pulse" | "restoring" | "revealing" | "restored";

export type RememberState = {
  scene: RememberScene;
  locale: RememberLocale;
  muted: boolean;
  currentStage: RememberStageId;
  completedStages: RememberStageId[];
  paused: boolean;
  archiveOpen: boolean;
  activeMemoryIndex: number;
  completedMemoryIds: MemoryId[];
  restoredFragmentIds: string[];
  restorationPhase: RestorationPhase;
};

export type RememberAction =
  | { type: "UNLOCK_MENU" }
  | { type: "BEGIN_GAME" }
  | { type: "START_NEW_GAME" }
  | { type: "HYDRATE_SAVE"; save: RememberSaveV1 }
  | { type: "ENTER_STAGE"; stage: RememberStageId }
  | { type: "COMPLETE_STAGE"; stage: RememberStageId }
  | { type: "OPEN_PAUSE" }
  | { type: "CLOSE_PAUSE" }
  | { type: "OPEN_ARCHIVE" }
  | { type: "CLOSE_ARCHIVE" }
  | { type: "RESTART_MEMORY" }
  | {
      type: "RESTORE_FRAGMENT";
      fragmentId: string;
      totalFragments: number;
      completesMemory?: boolean;
    }
  | { type: "UNRESTORE_FRAGMENT"; fragmentId: string; completesMemory?: boolean }
  | { type: "SET_RESTORATION_PHASE"; phase: RestorationPhase }
  | { type: "MARK_MEMORY_RESTORED"; memoryId: MemoryId }
  | { type: "CONTINUE" }
  | { type: "SET_LOCALE"; locale: RememberLocale }
  | { type: "SET_MUTED"; muted: boolean }
  | { type: "RESTART" };

export const initialRememberState: RememberState = {
  scene: "boot",
  locale: "pt",
  muted: false,
  currentStage: "hanamori",
  completedStages: [],
  paused: false,
  archiveOpen: false,
  activeMemoryIndex: 0,
  completedMemoryIds: [],
  restoredFragmentIds: [],
  restorationPhase: "idle",
};
