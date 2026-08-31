"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type {
  MemoryDefinition,
  OverlappingFragment,
  RealityState,
} from "@/components/remember/content/memory-definitions";
import type { RestorationPhase } from "@/components/remember/state/remember-state";
import {
  shouldMountKintsugiSeams,
  shouldMountRestorationEffect,
} from "@/components/remember/system/remember-render-policy";
import { GhostSeams } from "./ghost-seams";
import {
  createHanamoriGuidanceState,
  markHanamoriGuidanceLearned,
  recordHanamoriHint,
  shouldShowHanamoriHint,
} from "./hanamori-guidance";
import { KintsugiSeams } from "./kintsugi-seams";
import {
  activateLunarFocus,
  isRealitySnapAllowed,
  REALITY_CYCLE_MS,
  REALITY_REDUCED_CYCLE_MS,
  tickLunarFocus,
  tickRealityCycle,
  type LunarFocusState,
  type RealityCycleState,
} from "./lunar-focus-policy";
import {
  getFragmentSource,
  getRequiredFragmentIds,
  getRestoredRequiredFragmentCount,
  getStabilizedFalseFragmentIds,
  isFragmentReversible,
  isMemoryReadyForRestoration,
} from "./memory-mechanic-policy";
import { MemoryFragment } from "./memory-fragment";
import { MemoryRestorationEffect } from "./memory-restoration-effect";

type MemoryPuzzleProps = {
  memory: MemoryDefinition;
  restoredFragmentIds: string[];
  reducedMotion: boolean;
  interactive: boolean;
  restorationPhase: RestorationPhase;
  keyboardLabel: string;
  restoredLabel: string;
  completionLine: string;
  guidanceTitle: string;
  guidanceBody: string;
  lunarFocusLabel: string;
  lunarFocusReady: string;
  lunarFocusActive: string;
  lunarFocusCooldown: string;
  scatterSeed: number;
  onRestore: (fragmentId: string) => void;
  onUnrestore: (fragmentId: string) => void;
  onMistake: () => void;
  onRestorationPhaseChange: (phase: RestorationPhase) => void;
  onRestorationComplete: () => void;
  onKintsugi: () => void;
  onRestored: () => void;
};

const guidanceStyle: CSSProperties = {
  position: "absolute",
  zIndex: 9,
  left: "50%",
  bottom: "clamp(4.8rem, 10vh, 7.5rem)",
  width: "min(34rem, calc(100vw - 3rem))",
  transform: "translateX(-50%)",
  pointerEvents: "none",
  textAlign: "center",
  textShadow: "0 0.5rem 2rem rgb(0 0 0 / 0.82)",
};

const guidanceTitleStyle: CSSProperties = {
  display: "block",
  color: "rgb(228 214 193 / 0.78)",
  fontSize: "clamp(0.58rem, 0.8vw, 0.72rem)",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

const guidanceBodyStyle: CSSProperties = {
  margin: "0.55rem auto 0",
  color: "rgb(226 220 211 / 0.52)",
  fontFamily: "var(--display, Georgia, serif)",
  fontSize: "clamp(0.78rem, 1.1vw, 1rem)",
  lineHeight: 1.45,
};

const READY_FOCUS: LunarFocusState = { status: "ready" };
const INITIAL_REALITY: RealityCycleState = { reality: "a", elapsedMs: 0 };

export function MemoryPuzzle({
  memory,
  restoredFragmentIds,
  reducedMotion,
  interactive,
  restorationPhase,
  keyboardLabel,
  restoredLabel,
  completionLine,
  guidanceTitle,
  guidanceBody,
  lunarFocusLabel,
  lunarFocusReady,
  lunarFocusActive,
  lunarFocusCooldown,
  scatterSeed,
  onRestore,
  onUnrestore,
  onMistake,
  onRestorationPhaseChange,
  onRestorationComplete,
  onKintsugi,
  onRestored,
}: MemoryPuzzleProps) {
  const restored = new Set(restoredFragmentIds);
  const requiredFragmentIds = getRequiredFragmentIds(memory);
  const restoredRequiredCount = getRestoredRequiredFragmentCount(memory, restoredFragmentIds);
  const stabilizedFalseFragmentIds = getStabilizedFalseFragmentIds(memory, restoredFragmentIds);
  const unstable = stabilizedFalseFragmentIds.length > 0;
  const readyForRestoration = isMemoryReadyForRestoration(memory, restoredFragmentIds);
  const visuallyRestored = restorationPhase === "restored";
  const showKintsugiSeams = shouldMountKintsugiSeams(restorationPhase);
  const showRestorationEffect = shouldMountRestorationEffect(restorationPhase);
  const reversible = isFragmentReversible(memory) && restorationPhase === "idle";
  const showGhostSeams = memory.mechanic === "standard" && restorationPhase === "idle";
  const showHanamoriGuidance =
    interactive &&
    memory.id === "hanamori" &&
    restorationPhase === "idle" &&
    restoredRequiredCount === 0;
  const [activeFragmentId, setActiveFragmentId] = useState<string | null>(null);
  const [hintPulse, setHintPulse] = useState(0);
  const [focusState, setFocusState] = useState<LunarFocusState>(READY_FOCUS);
  const [currentReality, setCurrentReality] = useState<RealityState>("a");
  const focusStateRef = useRef<LunarFocusState>(READY_FOCUS);
  const realityCycleRef = useRef<RealityCycleState>(INITIAL_REALITY);
  const guidanceStateRef = useRef(createHanamoriGuidanceState());
  const guidanceElapsedRef = useRef(0);
  const overlapping = memory.mechanic === "overlapping";
  const focusActive = overlapping && focusState.status === "active";
  const lastFragmentId = restoredFragmentIds.at(-1);
  const lastFragment = memory.fragments.find((fragment) => fragment.id === lastFragmentId);
  const originPoint = lastFragment
    ? {
        x: 50 + lastFragment.initial.x * 85,
        y: 50 + lastFragment.initial.y * 85,
      }
    : { x: 50, y: 50 };
  useEffect(() => {
    if (memory.id !== "hanamori" || restoredRequiredCount === 0) return;
    guidanceStateRef.current = markHanamoriGuidanceLearned(guidanceStateRef.current);
  }, [memory.id, restoredRequiredCount]);

  useEffect(() => {
    if (
      memory.id !== "hanamori" ||
      !interactive ||
      restorationPhase !== "idle" ||
      restoredRequiredCount > 0 ||
      guidanceStateRef.current.learned
    ) {
      return;
    }

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      guidanceElapsedRef.current += Math.max(0, now - previous);
      previous = now;

      if (shouldShowHanamoriHint(guidanceStateRef.current, guidanceElapsedRef.current)) {
        guidanceStateRef.current = recordHanamoriHint(
          guidanceStateRef.current,
          guidanceElapsedRef.current,
        );
        setHintPulse((pulse) => pulse + 1);
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [interactive, memory.id, restorationPhase, restoredRequiredCount]);

  useEffect(() => {
    if (!overlapping || !interactive || restorationPhase !== "idle") return;

    let frame = 0;
    let previous = performance.now();
    const cycleMs = reducedMotion ? REALITY_REDUCED_CYCLE_MS : REALITY_CYCLE_MS;

    const tick = (now: number) => {
      const delta = Math.max(0, now - previous);
      previous = now;

      const nextFocus = tickLunarFocus(focusStateRef.current, delta, false);
      if (nextFocus !== focusStateRef.current) {
        focusStateRef.current = nextFocus;
        setFocusState(nextFocus);
      }

      const nextReality = tickRealityCycle(
        realityCycleRef.current,
        delta,
        false,
        nextFocus.status === "active",
        cycleMs,
      );
      realityCycleRef.current = nextReality;
      setCurrentReality((current) =>
        current === nextReality.reality ? current : nextReality.reality,
      );

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [interactive, overlapping, reducedMotion, restorationPhase]);

  const activateFocus = useCallback(() => {
    if (!overlapping || !interactive || restorationPhase !== "idle") return;
    const nextFocus = activateLunarFocus(focusStateRef.current);
    if (nextFocus === focusStateRef.current) return;
    focusStateRef.current = nextFocus;
    setFocusState(nextFocus);
  }, [interactive, overlapping, restorationPhase]);

  useEffect(() => {
    if (!overlapping) return;

    const handleFocusKey = (event: globalThis.KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || event.defaultPrevented) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          'button, a, input, textarea, select, [contenteditable="true"], [role="button"]',
        )
      ) {
        return;
      }

      event.preventDefault();
      activateFocus();
    };

    window.addEventListener("keydown", handleFocusKey);
    return () => window.removeEventListener("keydown", handleFocusKey);
  }, [activateFocus, overlapping]);

  const focusStatus =
    focusState.status === "active"
      ? lunarFocusActive
      : focusState.status === "cooldown"
        ? lunarFocusCooldown
        : lunarFocusReady;
  const focusSeconds =
    focusState.status === "ready" ? null : Math.max(1, Math.ceil(focusState.remainingMs / 1000));

  return (
    <div
      className={[
        "remember-memory",
        `remember-memory--${memory.id}`,
        overlapping && "remember-memory--overlapping",
        focusActive && "is-lunar-focus",
        visuallyRestored && "is-complete",
        unstable && "is-unstable",
        !interactive && "is-locked",
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label={`${keyboardLabel}: ${memory.title}`}
      data-memory-id={memory.id}
      data-memory-unstable={unstable ? "true" : "false"}
      data-restoration-phase={restorationPhase}
      data-current-reality={overlapping ? currentReality : undefined}
      data-lunar-focus-state={overlapping ? focusState.status : undefined}
    >
      {memory.id === "hanamori" ? (
        <div className="remember-memory__atmosphere" aria-hidden="true">
          <Image
            src={rememberAssets.sakuraBranch}
            alt=""
            fill
            sizes="40vw"
            className="remember-memory__sakura"
          />
          <Image
            src={rememberAssets.shrineRuins}
            alt=""
            fill
            sizes="40vw"
            className="remember-memory__ruins"
          />
          <Image
            src={rememberAssets.stoneLantern}
            alt=""
            fill
            sizes="20vw"
            className="remember-memory__lantern"
          />
          <Image
            src={rememberAssets.tallGrass}
            alt=""
            fill
            sizes="45vw"
            className="remember-memory__grass"
          />
        </div>
      ) : (
        <div className="remember-memory__realm-atmosphere" aria-hidden="true" />
      )}

      {showHanamoriGuidance ? (
        <div
          className="remember-memory-guidance"
          data-hanamori-guidance
          role="status"
          style={guidanceStyle}
        >
          <span style={guidanceTitleStyle}>{guidanceTitle}</span>
          <p style={guidanceBodyStyle}>{guidanceBody}</p>
        </div>
      ) : null}

      <div className="remember-memory__surface" data-remember-memory-surface>
        {memory.mechanic === "overlapping" ? (
          <>
            <Image
              src={memory.stateAAsset}
              alt=""
              fill
              priority={false}
              sizes="(max-width: 900px) 94vw, 76vw"
              className="remember-memory__ghost remember-memory__reality-layer"
              style={{ opacity: currentReality === "a" ? 0.18 : 0.035 }}
            />
            <Image
              src={memory.stateBAsset}
              alt=""
              fill
              priority={false}
              sizes="(max-width: 900px) 94vw, 76vw"
              className="remember-memory__ghost remember-memory__reality-layer"
              style={{ opacity: currentReality === "b" ? 0.18 : 0.035 }}
            />
            {focusActive ? (
              <Image
                src={memory.focusOverlayAsset}
                alt=""
                fill
                sizes="(max-width: 900px) 94vw, 76vw"
                className="remember-memory__focus-overlay"
                aria-hidden="true"
              />
            ) : null}
          </>
        ) : (
          <Image
            src={memory.brokenAsset}
            alt=""
            fill
            priority={memory.index === 1}
            sizes="(max-width: 900px) 94vw, 76vw"
            className="remember-memory__ghost"
          />
        )}

        {memory.mechanic === "false-memory" && unstable ? (
          <Image
            src={memory.distortionAsset}
            alt=""
            fill
            sizes="(max-width: 900px) 94vw, 76vw"
            className="remember-memory__distortion"
            style={{
              zIndex: 5,
              objectFit: "cover",
              opacity: reducedMotion ? 0.28 : 0.42,
              mixBlendMode: "screen",
              filter: "contrast(1.08) saturate(0.82)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
        ) : null}

        {showGhostSeams ? (
          <GhostSeams
            memoryId={memory.id}
            viewBox={memory.viewBox}
            seams={memory.seams}
            restoredFragmentIds={restoredFragmentIds}
            activeFragmentId={activeFragmentId}
            hintPulse={hintPulse}
          />
        ) : null}

        <div className="remember-memory__fragments">
          {memory.fragments.map((fragment) => {
            const overlappingFragment =
              memory.mechanic === "overlapping" ? (fragment as OverlappingFragment) : null;
            const source = overlappingFragment
              ? memory.stateAAsset
              : getFragmentSource(memory, fragment);
            const alternateSource = overlappingFragment ? memory.stateBAsset : undefined;
            const sourceBlend = overlappingFragment
              ? focusActive
                ? overlappingFragment.stableReality === "b"
                  ? 1
                  : 0
                : currentReality === "b"
                  ? 1
                  : 0
              : 0;
            const canRestore = overlappingFragment
              ? () =>
                  isRealitySnapAllowed(
                    overlappingFragment.stableReality,
                    currentReality,
                    focusStateRef.current,
                  )
              : undefined;

            return (
              <MemoryFragment
                key={fragment.id}
                memory={memory}
                viewBox={memory.viewBox}
                definition={fragment}
                source={source}
                alternateSource={alternateSource}
                sourceBlend={sourceBlend}
                restored={restored.has(fragment.id)}
                reversible={interactive && reversible}
                reducedMotion={reducedMotion}
                keyboardLabel={keyboardLabel}
                scatterSeed={scatterSeed}
                canRestore={canRestore}
                onRestore={interactive ? onRestore : () => undefined}
                onInvalidRestore={overlappingFragment && interactive ? onMistake : undefined}
                onUnrestore={interactive ? onUnrestore : undefined}
                onInteractionChange={setActiveFragmentId}
              />
            );
          })}
        </div>

        {showKintsugiSeams && (
          <KintsugiSeams
            viewBox={memory.viewBox}
            seams={memory.seams}
            restoredFragmentIds={restoredFragmentIds}
            complete={visuallyRestored}
          />
        )}

        <div className="remember-memory__restored" aria-hidden="true">
          <Image
            src={memory.restoredAsset}
            alt=""
            fill
            sizes="(max-width: 900px) 94vw, 76vw"
            className="remember-memory__restored-image"
          />
        </div>

        {showRestorationEffect && (
          <MemoryRestorationEffect
            active
            memory={memory}
            originPoint={originPoint}
            reducedMotion={reducedMotion}
            restoredLabel={restoredLabel}
            completionLine={completionLine}
            onPhaseChange={onRestorationPhaseChange}
            onComplete={onRestorationComplete}
            onKintsugi={onKintsugi}
            onRestored={onRestored}
          />
        )}

        <span className="remember-memory__edge" aria-hidden="true" />
      </div>

      {overlapping && restorationPhase === "idle" ? (
        <button
          type="button"
          className="remember-lunar-focus"
          data-lunar-focus
          data-status={focusState.status}
          disabled={!interactive || focusState.status !== "ready"}
          onClick={activateFocus}
          aria-label={`${lunarFocusLabel}: ${focusStatus}${focusSeconds ? ` ${focusSeconds}` : ""}`}
        >
          <span>{lunarFocusLabel}</span>
          <small>
            {focusStatus}
            {focusSeconds ? ` · ${focusSeconds}s` : ""}
          </small>
          <kbd aria-hidden="true">SPACE</kbd>
        </button>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {restoredRequiredCount} / {requiredFragmentIds.length}
        {unstable ? " — unstable" : ""}
        {readyForRestoration ? " — complete" : ""}
      </span>
    </div>
  );
}
