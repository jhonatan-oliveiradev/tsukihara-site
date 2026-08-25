"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { MemoryDefinition } from "@/components/remember/content/memory-definitions";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";
import { getMemoryIntroSchedule } from "@/components/remember/restore/memory-intro-timeline";
import { MemoryPuzzle } from "@/components/remember/restore/memory-puzzle";
import type { RestorationPhase } from "@/components/remember/state/remember-state";

type RestoreSceneProps = {
  memory: MemoryDefinition;
  copy: RememberLocaleCopy["memory"];
  completionLine: string;
  restoredFragmentIds: string[];
  restorationPhase: RestorationPhase;
  reducedMotion: boolean;
  interactive: boolean;
  onRestore: (fragmentId: string) => void;
  onRestorationPhaseChange: (phase: RestorationPhase) => void;
  onRestorationComplete: () => void;
  onKintsugi: () => void;
  onRestored: () => void;
  onContinue: () => void;
};

export function RestoreScene({
  memory,
  copy,
  completionLine,
  restoredFragmentIds,
  restorationPhase,
  reducedMotion,
  interactive,
  onRestore,
  onRestorationPhaseChange,
  onRestorationComplete,
  onKintsugi,
  onRestored,
  onContinue,
}: RestoreSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const restored = restorationPhase === "restored";
  const climax = restorationPhase !== "idle" && !restored;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const schedule = getMemoryIntroSchedule(reducedMotion);
    const intro = root.querySelector("[data-memory-intro]");
    const introLabel = root.querySelector("[data-memory-intro-label]");
    const introTitle = root.querySelector("[data-memory-intro-title]");
    const introJp = root.querySelector("[data-memory-intro-jp]");
    const label = root.querySelector("[data-restore-label]");
    const instruction = root.querySelector("[data-restore-instruction]");
    const memorySurface = root.querySelector(".remember-memory__surface");

    if (!intro || !introLabel || !introTitle || !introJp || !label || !instruction || !memorySurface) return;

    const ctx = gsap.context(() => {
      gsap.set(intro, { opacity: 1 });
      gsap.set([label, instruction], { opacity: 0 });
      gsap.set(memorySurface, {
        opacity: 0,
        scale: reducedMotion ? 1 : 0.975,
        filter: reducedMotion ? "none" : "blur(16px) brightness(0.55)",
      });
      gsap.set([introLabel, introTitle, introJp], { opacity: 0 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (reducedMotion) {
        timeline
          .to(introLabel, { opacity: 0.72, duration: 0.12 }, schedule.labelIn)
          .to(introTitle, { opacity: 1, duration: 0.16 }, schedule.titleIn)
          .to(introJp, { opacity: 0.48, duration: 0.14 }, schedule.jpIn)
          .to([introLabel, introTitle, introJp], { opacity: 0, duration: 0.16 }, schedule.copyOut)
          .to(intro, { opacity: 0, duration: 0.28 }, schedule.copyOut)
          .to(memorySurface, { opacity: 1, duration: 0.34 }, schedule.surfaceIn)
          .to([label, instruction], { opacity: 1, duration: 0.24 }, schedule.uiIn);
      } else {
        timeline
          .fromTo(
            introLabel,
            { opacity: 0, y: 12, letterSpacing: "0.48em" },
            { opacity: 0.76, y: 0, letterSpacing: "0.28em", duration: 0.58 },
            schedule.labelIn,
          )
          .fromTo(
            introTitle,
            { opacity: 0, y: 28, scale: 1.025, filter: "blur(10px)" },
            { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.88 },
            schedule.titleIn,
          )
          .fromTo(
            introJp,
            { opacity: 0, y: 10, filter: "blur(5px)" },
            { opacity: 0.52, y: 0, filter: "blur(0px)", duration: 0.68 },
            schedule.jpIn,
          )
          .to(
            [introLabel, introTitle, introJp],
            { opacity: 0, y: -10, filter: "blur(7px)", duration: 0.55, ease: "power2.in" },
            schedule.copyOut,
          )
          .to(intro, { opacity: 0, duration: 0.82, ease: "power2.inOut" }, schedule.copyOut + 0.1)
          .fromTo(
            memorySurface,
            { opacity: 0, scale: 0.975, filter: "blur(16px) brightness(0.55)" },
            { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", duration: 0.92 },
            schedule.surfaceIn,
          )
          .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.56 }, schedule.uiIn)
          .fromTo(
            instruction,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.5 },
            schedule.uiIn + 0.08,
          );
      }

      timeline.call(() => setIntroComplete(true), [], schedule.complete);
    }, root);

    return () => ctx.revert();
  }, [memory.id, reducedMotion]);

  return (
    <section
      ref={rootRef}
      className={["remember-restore", climax && "is-climax", restored && "is-restored"]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="remember-restore-title"
      data-memory-id={memory.id}
      data-memory-intro-state={introComplete ? "complete" : "playing"}
    >
      <div
        className={["remember-memory-intro", introComplete && "is-finished"].filter(Boolean).join(" ")}
        data-memory-intro
        aria-hidden="true"
      >
        <div className="remember-memory-intro__copy">
          <span data-memory-intro-label>
            {copy.label} {String(memory.index).padStart(2, "0")}
          </span>
          <strong data-memory-intro-title>{memory.title}</strong>
          <small data-memory-intro-jp>{memory.titleJp}</small>
        </div>
      </div>

      <div className="remember-restore__header" data-restore-label>
        <span>
          {copy.label} / {String(memory.index).padStart(2, "0")}
        </span>
        <h1 id="remember-restore-title">{memory.title}</h1>
        <small>{memory.titleJp}</small>
      </div>

      <MemoryPuzzle
        memory={memory}
        restoredFragmentIds={restoredFragmentIds}
        restorationPhase={restorationPhase}
        reducedMotion={reducedMotion}
        interactive={interactive && introComplete}
        keyboardLabel={copy.keyboardAction}
        restoredLabel={copy.restored}
        completionLine={completionLine}
        onRestore={onRestore}
        onRestorationPhaseChange={onRestorationPhaseChange}
        onRestorationComplete={onRestorationComplete}
        onKintsugi={onKintsugi}
        onRestored={onRestored}
      />

      <div
        className={[
          "remember-restore__instruction",
          restoredFragmentIds.length > 0 && "is-receded",
          climax && "is-hidden",
          restored && "is-restored",
        ]
          .filter(Boolean)
          .join(" ")}
        data-restore-instruction
      >
        {restored ? (
          <button type="button" className="remember-restore__continue" onClick={onContinue}>
            <span>{copy.continue}</span>
            <i aria-hidden="true" />
          </button>
        ) : (
          <>
            <span>{copy.instruction}</span>
            <i aria-hidden="true" />
            <small>
              {copy.fragments} {String(restoredFragmentIds.length).padStart(2, "0")} /{" "}
              {String(memory.fragments.length).padStart(2, "0")}
            </small>
          </>
        )}
      </div>
    </section>
  );
}
