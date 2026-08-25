"use client";

import { HANAMORI_VIEWBOX, hanamoriSeams } from "./restore-geometry";

const seamParticles: Record<string, Array<{ x: number; y: number }>> = {
  "seam-a": [
    { x: 495, y: 96 },
    { x: 470, y: 210 },
    { x: 492, y: 306 },
  ],
  "seam-b": [
    { x: 887, y: 296 },
    { x: 797, y: 263 },
    { x: 696, y: 310 },
  ],
  "seam-c": [
    { x: 334, y: 327 },
    { x: 512, y: 318 },
    { x: 522, y: 466 },
  ],
  "seam-d": [
    { x: 590, y: 271 },
    { x: 705, y: 325 },
    { x: 730, y: 468 },
  ],
  "seam-e": [
    { x: 792, y: 261 },
    { x: 887, y: 298 },
    { x: 954, y: 281 },
  ],
};

type KintsugiSeamsProps = {
  restoredFragmentIds: string[];
  complete: boolean;
};

export function KintsugiSeams({ restoredFragmentIds, complete }: KintsugiSeamsProps) {
  const restored = new Set(restoredFragmentIds);

  return (
    <svg
      className={["remember-kintsugi", complete && "is-complete"].filter(Boolean).join(" ")}
      viewBox={`0 0 ${HANAMORI_VIEWBOX.width} ${HANAMORI_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {hanamoriSeams.map((seam) => {
        const active = restored.has(seam.fragmentId);
        return (
          <g
            key={seam.id}
            className={active ? "remember-kintsugi__seam is-active" : "remember-kintsugi__seam"}
          >
            <path
              d={seam.path}
              pathLength="1"
              className="remember-kintsugi__path remember-kintsugi__path--halo"
            />
            <path
              d={seam.path}
              pathLength="1"
              className="remember-kintsugi__path remember-kintsugi__path--core"
            />
            {active &&
              seamParticles[seam.id]?.map((particle, index) => (
                <circle
                  key={`${seam.id}-${index}`}
                  cx={particle.x}
                  cy={particle.y}
                  r={index === 1 ? 2.4 : 1.6}
                  className="remember-kintsugi__particle"
                  style={{ animationDelay: `${index * 90}ms` }}
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
}
