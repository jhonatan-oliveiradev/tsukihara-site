"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { finalJourneyAssets } from "@/content/final-journey";

type FinalMoonEasterEggProps = {
  label: string;
  message: string;
};

type EasterEggPhase = "idle" | "eclipse" | "message";

export function FinalMoonEasterEgg({ label, message }: FinalMoonEasterEggProps) {
  const [phase, setPhase] = useState<EasterEggPhase>("idle");
  const revealTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current);
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    revealTimerRef.current = null;
    resetTimerRef.current = null;
  };

  const activate = () => {
    clearTimers();
    setPhase("eclipse");
    revealTimerRef.current = window.setTimeout(() => setPhase("message"), 900);
    resetTimerRef.current = window.setTimeout(() => setPhase("idle"), 4200);
  };

  useEffect(() => clearTimers, []);

  return (
    <div className="ix-final-easter-egg" data-phase={phase}>
      <button
        type="button"
        className="ix-final-easter-egg__moon"
        aria-label={label}
        onPointerEnter={activate}
        onFocus={activate}
        onClick={activate}
      >
        <span className="ix-final-easter-egg__asset" aria-hidden="true">
          <Image
            src={finalJourneyAssets.ornament}
            alt=""
            fill
            sizes="96px"
            className="ix-final-easter-egg__image"
          />
          <i className="ix-final-easter-egg__shadow" />
        </span>
      </button>
      <span className="ix-final-easter-egg__message" aria-live="polite">
        {phase === "message" ? message : ""}
      </span>
    </div>
  );
}
