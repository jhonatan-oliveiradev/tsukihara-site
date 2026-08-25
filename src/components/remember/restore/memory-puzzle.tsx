"use client";

import Image from "next/image";
import type { MemoryDefinition } from "@/components/remember/content/memory-definitions";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RestorationPhase } from "@/components/remember/state/remember-state";
import { KintsugiSeams } from "./kintsugi-seams";
import { MemoryFragment } from "./memory-fragment";

type MemoryPuzzleProps = {
  memory: MemoryDefinition;
  restoredFragmentIds: string[];
  reducedMotion: boolean;
  interactive: boolean;
  restorationPhase: RestorationPhase;
  keyboardLabel: string;
  onRestore: (fragmentId: string) => void;
};

export function MemoryPuzzle({
  memory,
  restoredFragmentIds,
  reducedMotion,
  interactive,
  restorationPhase,
  keyboardLabel,
  onRestore,
}: MemoryPuzzleProps) {
  const restored = new Set(restoredFragmentIds);
  const allFragmentsPlaced = restoredFragmentIds.length === memory.fragments.length;
  const visuallyRestored = restorationPhase === "restored";

  return (
    <div
      className={[
        "remember-memory",
        `remember-memory--${memory.id}`,
        visuallyRestored && "is-complete",
        !interactive && "is-locked",
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label={`${keyboardLabel}: ${memory.title}`}
      data-memory-id={memory.id}
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

        <div className="remember-memory__fragments">
          {memory.fragments.map((fragment) => (
            <MemoryFragment
              key={fragment.id}
              memoryId={memory.id}
              viewBox={memory.viewBox}
              definition={fragment}
              source={memory.brokenAsset}
              restored={restored.has(fragment.id)}
              reducedMotion={reducedMotion}
              keyboardLabel={keyboardLabel}
              onRestore={interactive ? onRestore : () => undefined}
            />
          ))}
        </div>

        <KintsugiSeams
          viewBox={memory.viewBox}
          seams={memory.seams}
          restoredFragmentIds={restoredFragmentIds}
          complete={visuallyRestored}
        />

        <div className="remember-memory__restored" aria-hidden="true">
          <Image
            src={memory.restoredAsset}
            alt=""
            fill
            sizes="(max-width: 900px) 94vw, 76vw"
            className="remember-memory__restored-image"
          />
        </div>

        <span className="remember-memory__edge" aria-hidden="true" />
      </div>

      <span className="sr-only" aria-live="polite">
        {restoredFragmentIds.length} / {memory.fragments.length}
        {allFragmentsPlaced ? " — complete" : ""}
      </span>
    </div>
  );
}
