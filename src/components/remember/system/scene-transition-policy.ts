export type TransitionState = "idle" | "exiting" | "covered" | "entering";

export type SceneTransitionTimings = {
  exitMs: number;
  enterMs: number;
};

export const canRequestTransition = (state: TransitionState) => state === "idle";

export const canCommitDestination = (state: TransitionState) => state === "covered";

export const getSceneTransitionTimings = (reducedMotion: boolean): SceneTransitionTimings =>
  reducedMotion
    ? { exitMs: 110, enterMs: 170 }
    : {
        exitMs: 420,
        enterMs: 720,
      };
