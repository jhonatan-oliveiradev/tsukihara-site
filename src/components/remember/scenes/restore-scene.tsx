"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { rememberCopy } from "@/components/remember/content/remember-copy";
import { hanamoriFragments } from "@/components/remember/restore/restore-geometry";
import { HanamoriMemory } from "@/components/remember/restore/hanamori-memory";
import { trackRememberEvent } from "@/components/remember/system/remember-analytics";

type RestoreSceneProps = {
  restoredFragmentIds: string[];
  reducedMotion: boolean;
  interactive: boolean;
  onRestore: (fragmentId: string) => void;
};

export function RestoreScene({
  restoredFragmentIds,
  reducedMotion,
  interactive,
  onRestore,
}: RestoreSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const completionTrackedRef = useRef(false);
  const complete = restoredFragmentIds.length === hanamoriFragments.length;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const label = root.querySelector("[data-restore-label]");
      const instruction = root.querySelector("[data-restore-instruction]");
      const memory = root.querySelector(".remember-memory__surface");

      if (reducedMotion) {
        gsap.fromTo(
          [label, instruction, memory],
          { opacity: 0 },
          { opacity: 1, duration: 0.35, stagger: 0.08 },
        );
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          memory,
          { opacity: 0, scale: 0.985, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.15 },
        )
        .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.35)
        .fromTo(instruction, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.65 }, 0.5);
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!complete || completionTrackedRef.current) return;
    completionTrackedRef.current = true;
    trackRememberEvent("remember_restore_completed", { realm: "hanamori" });
  }, [complete]);

  return (
    <section
      ref={rootRef}
      className={["remember-restore", complete && "is-complete"].filter(Boolean).join(" ")}
      aria-labelledby="remember-restore-title"
    >
      <div className="remember-restore__header" data-restore-label>
        <span>MEMORY / 01</span>
        <h1 id="remember-restore-title">{rememberCopy.restore.realm}</h1>
        <small>花守</small>
      </div>

      <HanamoriMemory
        restoredFragmentIds={restoredFragmentIds}
        reducedMotion={reducedMotion}
        interactive={interactive}
        onRestore={onRestore}
      />

      <div
        className={["remember-restore__instruction", restoredFragmentIds.length > 0 && "is-receded"]
          .filter(Boolean)
          .join(" ")}
        data-restore-instruction
      >
        <span>{rememberCopy.restore.instruction}</span>
        <i aria-hidden="true" />
        <small>
          {String(restoredFragmentIds.length).padStart(2, "0")} /{" "}
          {String(hanamoriFragments.length).padStart(2, "0")}
        </small>
      </div>
    </section>
  );
}
