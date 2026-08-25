"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { MemoryDefinition } from "@/components/remember/content/memory-definitions";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";
import { MemoryPuzzle } from "@/components/remember/restore/memory-puzzle";
import type { RestorationPhase } from "@/components/remember/state/remember-state";

type RestoreSceneProps = {
  memory: MemoryDefinition;
  copy: RememberLocaleCopy["memory"];
  restoredFragmentIds: string[];
  restorationPhase: RestorationPhase;
  reducedMotion: boolean;
  interactive: boolean;
  onRestore: (fragmentId: string) => void;
  onContinue: () => void;
};

export function RestoreScene({
  memory,
  copy,
  restoredFragmentIds,
  restorationPhase,
  reducedMotion,
  interactive,
  onRestore,
  onContinue,
}: RestoreSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const restored = restorationPhase === "restored";
  const climax = restorationPhase !== "idle" && !restored;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const label = root.querySelector("[data-restore-label]");
      const instruction = root.querySelector("[data-restore-instruction]");
      const memorySurface = root.querySelector(".remember-memory__surface");

      if (reducedMotion) {
        gsap.fromTo(
          [label, instruction, memorySurface],
          { opacity: 0 },
          { opacity: 1, duration: 0.35, stagger: 0.08 },
        );
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          memorySurface,
          { opacity: 0, scale: 0.985, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.15 },
        )
        .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.35)
        .fromTo(instruction, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.65 }, 0.5);
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
    >
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
        interactive={interactive}
        keyboardLabel={copy.keyboardAction}
        onRestore={onRestore}
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
