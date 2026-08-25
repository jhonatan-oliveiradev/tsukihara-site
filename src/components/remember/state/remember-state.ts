export type RememberScene =
  | "boot"
  | "menu"
  | "memory"
  | "akari-reveal"
  | "epilogue"
  | "credits";

export type RememberLocale = "pt" | "en";

export type MemoryId = "hanamori" | "mizukyo" | "kurogane";

export type RestorationPhase =
  | "idle"
  | "last-piece"
  | "kintsugi"
  | "pulse"
  | "restoring"
  | "revealing"
  | "restored";

export type RememberState = {
  scene: RememberScene;
  locale: RememberLocale;
  muted: boolean;
  activeMemoryIndex: number;
  completedMemoryIds: MemoryId[];
  restoredFragmentIds: string[];
  restorationPhase: RestorationPhase;
};

export type RememberAction =
  | { type: "UNLOCK_MENU" }
  | { type: "BEGIN_GAME" }
  | { type: "RESTORE_FRAGMENT"; fragmentId: string; totalFragments: number }
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
  activeMemoryIndex: 0,
  completedMemoryIds: [],
  restoredFragmentIds: [],
  restorationPhase: "idle",
};
