"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const JP_REVEAL_EVENT = "tsukihara:jp-reveal";

export function useGameplayChapterTimeline(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 901px)").matches;

    if (reduced || !desktop) return;

    const scenes = gsap.utils.toArray<HTMLElement>("[data-gameplay-scene]", root);
    const copies = gsap.utils.toArray<HTMLElement>("[data-gameplay-copy]", root);
    const progressItems = gsap.utils.toArray<HTMLElement>("[data-gameplay-progress]", root);
    const phaseStarts = [0.08, 0.22, 0.38, 0.54, 0.7, 0.86];
    let revealedBeat = -1;

    const revealBeatTitle = (index: number) => {
      if (index === revealedBeat) return;
      revealedBeat = index;
      copies[index]
        ?.querySelector<HTMLElement>("[data-jp-reveal-deferred]")
        ?.dispatchEvent(new CustomEvent(JP_REVEAL_EVENT));
    };

    const ctx = gsap.context(() => {
      gsap.set(scenes, { autoAlpha: 0 });
      gsap.set(copies, { autoAlpha: 0, y: 22 });
      gsap.set(progressItems, { opacity: 0.34 });
      if (scenes[0]) gsap.set(scenes[0], { autoAlpha: 1 });
      if (copies[0]) gsap.set(copies[0], { autoAlpha: 1, y: 0 });
      if (progressItems[0]) gsap.set(progressItems[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onEnter: () => revealBeatTitle(0),
          onEnterBack: () => revealBeatTitle(5),
          onUpdate: (self) => {
            let activeIndex = 0;
            phaseStarts.forEach((start, index) => {
              if (self.progress >= start) activeIndex = index;
            });
            revealBeatTitle(activeIndex);
          },
        },
      });

      scenes.forEach((scene, index) => {
        const start = phaseStarts[index];
        if (index === 0) return;
        const previousScene = scenes[index - 1];
        const previousCopy = copies[index - 1];
        const previousProgress = progressItems[index - 1];
        const copy = copies[index];
        const progress = progressItems[index];

        tl.to(previousScene, { autoAlpha: 0, duration: 0.05, ease: "none" }, start - 0.025)
          .to(previousCopy, { autoAlpha: 0, y: -16, duration: 0.04, ease: "none" }, start - 0.02)
          .to(previousProgress, { opacity: 0.34, duration: 0.03 }, start - 0.015)
          .fromTo(
            scene,
            { autoAlpha: 0, scale: 1.025 },
            { autoAlpha: 1, scale: 1, duration: 0.055, ease: "power2.out" },
            start,
          )
          .fromTo(
            copy,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" },
            start + 0.01,
          )
          .to(progress, { opacity: 1, duration: 0.03 }, start + 0.01);
      });

      tl.fromTo(
        "[data-gameplay-reveal-after]",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.09, ease: "none" },
        0.255,
      )
        .fromTo(
          "[data-gameplay-reveal-seam]",
          { left: "4%", opacity: 0 },
          { left: "96%", opacity: 1, duration: 0.09, ease: "none" },
          0.255,
        )
        .fromTo(
          "[data-gameplay-restore-after]",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.11, ease: "none" },
          0.415,
        )
        .fromTo(
          "[data-gameplay-crack-light]",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.08, ease: "none" },
          0.405,
        )
        .fromTo(
          "[data-gameplay-combat-shift]",
          { autoAlpha: 0, clipPath: "circle(8% at 54% 48%)" },
          { autoAlpha: 0.9, clipPath: "circle(62% at 54% 48%)", duration: 0.08, ease: "none" },
          0.735,
        )
        .fromTo(
          "[data-gameplay-combat-fx]",
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 0.72, scale: 1.03, duration: 0.055, ease: "power2.out" },
          0.765,
        )
        .fromTo(
          "[data-gameplay-boss-image]",
          { scale: 1.08, yPercent: 3 },
          { scale: 1, yPercent: 0, duration: 0.12, ease: "power1.out" },
          0.86,
        );

      gsap.fromTo(
        "[data-gameplay-environment-fx]",
        { yPercent: 5, xPercent: -2 },
        {
          yPercent: -5,
          xPercent: 2,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        },
      );
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [rootRef]);
}
