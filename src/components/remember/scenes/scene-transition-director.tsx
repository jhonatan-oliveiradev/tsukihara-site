"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import {
  canCommitDestination,
  canRequestTransition,
  getSceneTransitionTimings,
  type TransitionState,
} from "@/components/remember/system/scene-transition-policy";

export type SceneTransitionDirectorHandle = {
  requestTransition: (
    commitDestination: () => void,
    prepareDestination?: () => Promise<void>,
  ) => Promise<boolean>;
};

type SceneTransitionDirectorProps = {
  reducedMotion: boolean;
  label: string;
  onStateChange?: (state: TransitionState) => void;
};

const tweenOpacity = (node: HTMLElement, opacity: number, durationMs: number) =>
  new Promise<void>((resolve) => {
    gsap.to(node, {
      opacity,
      duration: durationMs / 1000,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: resolve,
    });
  });

export const SceneTransitionDirector = forwardRef<
  SceneTransitionDirectorHandle,
  SceneTransitionDirectorProps
>(function SceneTransitionDirector({ reducedMotion, label, onStateChange }, ref) {
  const veilRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<TransitionState>("idle");
  const [state, setState] = useState<TransitionState>("idle");

  const updateState = useCallback(
    (next: TransitionState) => {
      stateRef.current = next;
      setState(next);
      onStateChange?.(next);
    },
    [onStateChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      requestTransition: async (commitDestination, prepareDestination) => {
        if (!canRequestTransition(stateRef.current)) return false;

        const veil = veilRef.current;
        if (!veil) return false;

        const timings = getSceneTransitionTimings(reducedMotion);
        updateState("exiting");
        veil.style.pointerEvents = "auto";
        await tweenOpacity(veil, 1, timings.exitMs);

        updateState("covered");
        if (!canCommitDestination(stateRef.current)) return false;
        commitDestination();

        try {
          await prepareDestination?.();
        } catch (error) {
          updateState("covered");
          throw error;
        }

        updateState("entering");
        await tweenOpacity(veil, 0, timings.enterMs);
        veil.style.pointerEvents = "none";
        updateState("idle");
        return true;
      },
    }),
    [reducedMotion, updateState],
  );

  return (
    <div
      ref={veilRef}
      className="remember-scene-transition"
      data-transition-state={state}
      aria-hidden="true"
    >
      <span className="remember-scene-transition__orbit">
        <i />月
      </span>
      <small>{label}</small>
    </div>
  );
});
