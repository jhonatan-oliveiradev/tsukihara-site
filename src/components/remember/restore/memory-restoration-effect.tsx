"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { MemoryDefinition } from "@/components/remember/content/memory-definitions";
import type { RestorationPhase } from "@/components/remember/state/remember-state";
import { getRestorationSchedule } from "./restoration-timeline";

type MemoryRestorationEffectProps = {
  active: boolean;
  memory: MemoryDefinition;
  originPoint: { x: number; y: number };
  reducedMotion: boolean;
  restoredLabel: string;
  completionLine: string;
  onPhaseChange: (phase: RestorationPhase) => void;
  onComplete: () => void;
  onKintsugi: () => void;
  onRestored: () => void;
};

export function MemoryRestorationEffect({
  active,
  memory,
  originPoint,
  reducedMotion,
  restoredLabel,
  completionLine,
  onPhaseChange,
  onComplete,
  onKintsugi,
  onRestored,
}: MemoryRestorationEffectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ranMemoryRef = useRef<string | null>(null);
  const callbacksRef = useRef({ onPhaseChange, onComplete, onKintsugi, onRestored });

  useLayoutEffect(() => {
    callbacksRef.current = { onPhaseChange, onComplete, onKintsugi, onRestored };
  }, [onComplete, onKintsugi, onPhaseChange, onRestored]);

  useLayoutEffect(() => {
    if (ranMemoryRef.current !== memory.id) ranMemoryRef.current = null;
    if (!active || ranMemoryRef.current === memory.id) return;

    const root = rootRef.current;
    const surface = root?.parentElement;
    if (!root || !surface) return;

    ranMemoryRef.current = memory.id;
    const schedule = getRestorationSchedule(reducedMotion);
    const at = Object.fromEntries(schedule.map((beat) => [beat.phase, beat.at])) as Record<
      Exclude<RestorationPhase, "idle">,
      number
    >;

    const particles = root.querySelector("[data-restoration-particles]");
    const cracks = root.querySelector("[data-restoration-cracks]");
    const pulse = root.querySelector("[data-restoration-pulse]");
    const burst = root.querySelector("[data-restoration-burst]");
    const scar = root.querySelector("[data-restoration-scar]");
    const copy = root.querySelector("[data-restoration-copy]");
    const fragments = surface.querySelector(".remember-memory__fragments");
    const restoredImage = surface.querySelector(".remember-memory__restored");

    const ctx = gsap.context(() => {
      gsap.set([particles, cracks, pulse, burst, scar, copy], { opacity: 0 });
      gsap.set([particles, cracks], { transformOrigin: `${originPoint.x}% ${originPoint.y}%` });
      gsap.set(pulse, {
        transformOrigin: `${originPoint.x}% ${originPoint.y}%`,
        xPercent: originPoint.x - 50,
        yPercent: originPoint.y - 50,
        scale: 0.58,
      });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      for (const beat of schedule) {
        timeline.call(
          () => {
            callbacksRef.current.onPhaseChange(beat.phase);
            if (beat.phase === "kintsugi") callbacksRef.current.onKintsugi();
            if (beat.phase === "revealing") callbacksRef.current.onRestored();
            if (beat.phase === "restored") callbacksRef.current.onComplete();
          },
          [],
          beat.at,
        );
      }

      if (!reducedMotion) {
        timeline
          .to(surface, { x: 2.2, y: -1.2, duration: 0.045, ease: "power1.out" }, 0.03)
          .to(surface, { x: -1.4, y: 1, duration: 0.05, ease: "power1.inOut" }, 0.075)
          .to(surface, { x: 0, y: 0, duration: 0.08, ease: "power2.out" }, 0.125);
      }

      timeline.fromTo(
        particles,
        { opacity: 0, scale: reducedMotion ? 1 : 0.84 },
        {
          opacity: reducedMotion ? 0.26 : 0.54,
          scale: 1,
          duration: reducedMotion ? 0.18 : 0.72,
        },
        at.kintsugi,
      );

      timeline.fromTo(
        cracks,
        { opacity: 0, scale: reducedMotion ? 1 : 0.985, filter: "brightness(0.8)" },
        {
          opacity: reducedMotion ? 0.42 : 0.8,
          scale: 1,
          filter: "brightness(1.18)",
          duration: reducedMotion ? 0.2 : 0.68,
        },
        at.kintsugi,
      );

      timeline.fromTo(
        pulse,
        { opacity: 0, scale: reducedMotion ? 0.92 : 0.58 },
        {
          opacity: reducedMotion ? 0.28 : 0.7,
          scale: reducedMotion ? 1.02 : 1.22,
          duration: reducedMotion ? 0.18 : 0.38,
          ease: "power2.out",
        },
        at.pulse,
      );
      timeline.to(
        pulse,
        { opacity: 0, scale: reducedMotion ? 1.04 : 1.34, duration: reducedMotion ? 0.14 : 0.3 },
        at.pulse + (reducedMotion ? 0.16 : 0.28),
      );

      timeline.to(
        fragments,
        { opacity: reducedMotion ? 0.22 : 0.08, duration: reducedMotion ? 0.24 : 0.72 },
        at.restoring,
      );
      timeline.to(
        restoredImage,
        {
          opacity: 1,
          filter: "brightness(1) saturate(1) blur(0px)",
          duration: reducedMotion ? 0.32 : 0.82,
        },
        at.restoring,
      );

      timeline.fromTo(
        burst,
        { opacity: 0, scale: reducedMotion ? 1 : 0.82 },
        {
          opacity: reducedMotion ? 0.22 : 0.58,
          scale: reducedMotion ? 1.02 : 1.08,
          duration: reducedMotion ? 0.16 : 0.34,
        },
        at.restoring + (reducedMotion ? 0.08 : 0.2),
      );
      timeline.to(
        burst,
        { opacity: 0, scale: reducedMotion ? 1.03 : 1.16, duration: reducedMotion ? 0.18 : 0.48 },
        at.restoring + (reducedMotion ? 0.22 : 0.48),
      );

      timeline.fromTo(
        scar,
        { opacity: 0 },
        { opacity: reducedMotion ? 0.24 : 0.5, duration: reducedMotion ? 0.18 : 0.42 },
        at.revealing - (reducedMotion ? 0.06 : 0.14),
      );
      timeline.to(
        scar,
        { opacity: 0.16, duration: reducedMotion ? 0.28 : 0.86 },
        Math.max(at.revealing + 0.2, at.restored - (reducedMotion ? 0.3 : 0.75)),
      );

      timeline.fromTo(
        copy,
        { opacity: 0, y: reducedMotion ? 0 : 14, filter: reducedMotion ? "none" : "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: reducedMotion ? 0.28 : 0.7,
        },
        at.revealing,
      );

      timeline.to(
        particles,
        { opacity: 0.08, duration: reducedMotion ? 0.3 : 1.05 },
        at.revealing + 0.2,
      );
      timeline.to(
        cracks,
        { opacity: 0.18, filter: "brightness(0.9)", duration: reducedMotion ? 0.3 : 0.95 },
        at.revealing + 0.25,
      );
    }, root);

    return () => ctx.revert();
  }, [active, memory.id, originPoint.x, originPoint.y, reducedMotion]);

  const style = {
    "--remember-origin-x": `${originPoint.x}%`,
    "--remember-origin-y": `${originPoint.y}%`,
    "--remember-memory-accent": memory.palette.accent,
    "--remember-memory-glow": memory.palette.glow,
  } as CSSProperties;

  return (
    <div ref={rootRef} className="remember-restoration" style={style} aria-hidden={!active}>
      <Image
        src={rememberAssets.memoryParticles}
        alt=""
        fill
        sizes="(max-width: 900px) 94vw, 76vw"
        className="remember-restoration__particles"
        data-restoration-particles
      />
      <Image
        src={rememberAssets.kintsugiCrackOverlay}
        alt=""
        fill
        sizes="(max-width: 900px) 94vw, 76vw"
        className="remember-restoration__cracks"
        data-restoration-cracks
      />
      <Image
        src={rememberAssets.memoryPulseRing}
        alt=""
        fill
        sizes="60vw"
        className="remember-restoration__pulse"
        data-restoration-pulse
      />
      <Image
        src={rememberAssets.completionBurst}
        alt=""
        fill
        sizes="(max-width: 900px) 94vw, 76vw"
        className="remember-restoration__burst"
        data-restoration-burst
      />
      <Image
        src={rememberAssets.restoredScarOverlay}
        alt=""
        fill
        sizes="(max-width: 900px) 94vw, 76vw"
        className="remember-restoration__scar"
        data-restoration-scar
      />

      <div className="remember-restoration__copy" data-restoration-copy>
        <span>MEMORY / {String(memory.index).padStart(2, "0")}</span>
        <strong>{restoredLabel}</strong>
        <h2>{memory.title}</h2>
        <p>{completionLine}</p>
      </div>
    </div>
  );
}
