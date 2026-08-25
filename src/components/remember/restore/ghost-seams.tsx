"use client";

import type { CSSProperties } from "react";
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

const baseOpacityForMemory = (memoryId: MemoryId) => {
  if (memoryId === "hanamori") return 0.13;
  if (memoryId === "mizukyo") return 0.065;
  if (memoryId === "kurogane") return 0.025;
  return 0;
};

const svgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 3,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "visible",
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
  const baseOpacity = baseOpacityForMemory(memoryId);

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
      style={svgStyle}
    >
      {seams.map((seam) => {
        if (restored.has(seam.fragmentId)) return null;
        const active = seam.fragmentId === activeFragmentId;
        const opacity = active ? Math.max(baseOpacity * 2.8, 0.28) : baseOpacity;
        return (
          <path
            key={seam.id}
            d={seam.path}
            pathLength="1"
            className={active ? "remember-ghost-seam is-active" : "remember-ghost-seam"}
            data-fragment-id={seam.fragmentId}
            fill="none"
            stroke="rgb(183 207 225)"
            strokeWidth={active ? 1.7 : 1.05}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={opacity}
            style={{
              filter: active ? "drop-shadow(0 0 7px rgb(150 193 221 / 0.32))" : "none",
              transition: "stroke-opacity 220ms ease, stroke-width 220ms ease, filter 220ms ease",
            }}
          >
            {hintPulse > 0 && memoryId === "hanamori" && !active ? (
              <animate
                attributeName="stroke-opacity"
                values={`${baseOpacity};0.34;${baseOpacity}`}
                dur="1.65s"
                repeatCount="1"
              />
            ) : null}
          </path>
        );
      })}
    </svg>
  );
}
