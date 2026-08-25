"use client";

import Image from "next/image";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { MemoryDefinition } from "@/components/remember/content/memory-definitions";
import type { RestorationPhase } from "@/components/remember/state/remember-state";
import {
  shouldMountKintsugiSeams,
  shouldMountRestorationEffect,
} from "@/components/remember/system/remember-render-policy";
import { KintsugiSeams } from "./kintsugi-seams";
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
  onRestore: (fragmentId: string) => void;
  onUnrestore: (fragmentId: string) => void;
  onRestorationPhaseChange: (phase: RestorationPhase) => void;
  onRestorationComplete: () => void;
  onKintsugi: () => void;
  onRestored: () => void;
};

export function MemoryPuzzle({
  memory,
  restoredFragmentIds,
  reducedMotion,
  interactive,
  restorationPhase,
  keyboardLabel,
  restoredLabel,
  completionLine,
  onRestore,
  onUnrestore,
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
  const lastFragmentId = restoredFragmentIds.at(-1);
  const lastFragment = memory.fragments.find((fragment) => fragment.id === lastFragmentId);
  const originPoint = lastFragment
    ? {
        x: 50 + lastFragment.initial.x * 85,
        y: 50 + lastFragment.initial.y * 85,
      }
    : { x: 50, y: 50 };

  return (
    <div
      className={[
        "remember-memory",
        `remember-memory--${memory.id}`,
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

      <div className="remember-memory__surface" data-remember-memory-surface>
        <Image
          src={memory.brokenAsset}
          alt=""
          fill
          priority={memory.index === 1}
          sizes="(max-width: 900px) 94vw, 76vw"
          className="remember-memory__ghost"
        />

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

        <div className="remember-memory__fragments">
          {memory.fragments.map((fragment) => (
            <MemoryFragment
              key={fragment.id}
              memoryId={memory.id}
              viewBox={memory.viewBox}
              definition={fragment}
              source={getFragmentSource(memory, fragment)}
              restored={restored.has(fragment.id)}
              reversible={interactive && reversible}
              reducedMotion={reducedMotion}
              keyboardLabel={keyboardLabel}
              onRestore={interactive ? onRestore : () => undefined}
              onUnrestore={interactive ? onUnrestore : undefined}
            />
          ))}
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

      <span className="sr-only" aria-live="polite">
        {restoredRequiredCount} / {requiredFragmentIds.length}
        {unstable ? " — unstable" : ""}
        {readyForRestoration ? " — complete" : ""}
      </span>
    </div>
  );
}
