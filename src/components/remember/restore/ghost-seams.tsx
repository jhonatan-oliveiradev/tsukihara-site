"use client";

import type { MemoryId } from "../state/remember-state";
import type { KintsugiSeamDefinition } from "./restore-geometry";

type GhostSeamsProps = {
  memoryId: MemoryId;
  viewBox: { width: number; height: number };
  seams: KintsugiSeamDefinition[];
  restoredFragmentIds: string[];
  activeFragmentId: string | null;
  hintPulse: number;
};

export function GhostSeams({
  memoryId,
  viewBox,
  seams,
  restoredFragmentIds,
  activeFragmentId,
  hintPulse,
}: GhostSeamsProps) {
  const restored = new Set(restoredFragmentIds);

  return (
    <svg
      key={`${memoryId}-${hintPulse}`}
      className={[
        "remember-ghost-seams",
        `remember-ghost-seams--${memoryId}`,
        hintPulse > 0 && "is-hinting",
      ]
        .filter(Boolean)
        .join(" ")}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {seams.map((seam) => {
        if (restored.has(seam.fragmentId)) return null;
        const active = seam.fragmentId === activeFragmentId;
        return (
          <path
            key={seam.id}
            d={seam.path}
            pathLength="1"
            className={active ? "remember-ghost-seam is-active" : "remember-ghost-seam"}
            data-fragment-id={seam.fragmentId}
          />
        );
      })}
    </svg>
  );
}
