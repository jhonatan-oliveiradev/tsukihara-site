export type RememberScene =
  | "entry"
  | "restore"
  | "memory-reveal"
  | "mochi"
  | "choice"
  | "corruption"
  | "eclipse"
  | "resist"
  | "void"
  | "awaken"
  | "akari-reveal"
  | "final"
  | "result";

export type RememberState = {
  scene: RememberScene;
  restoredFragmentIds: string[];
  muted: boolean;
  choice: string | null;
};

export type RememberAction =
  | { type: "ENTER" }
  | { type: "RESTORE_FRAGMENT"; fragmentId: string; totalFragments: number }
  | { type: "SET_MUTED"; muted: boolean }
  | { type: "RESTART" };

export const initialRememberState: RememberState = {
  scene: "entry",
  restoredFragmentIds: [],
  muted: false,
  choice: null,
};
