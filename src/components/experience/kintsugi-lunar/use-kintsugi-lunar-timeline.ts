"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useKintsugiLunarTimeline(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-kl-stage]");
        if (!stage) return;

        const opening = root.querySelector<HTMLElement>("[data-kl-copy='opening']");
        const awakening = root.querySelector<HTMLElement>("[data-kl-copy='awakening']");
        const transformation = root.querySelector<HTMLElement>("[data-kl-copy='transformation']");
        const complete = root.querySelector<HTMLElement>("[data-kl-copy='complete']");
        const relics = Array.from(root.querySelectorAll<HTMLElement>("[data-kl-relic]"));
        const gameplay = Array.from(root.querySelectorAll<HTMLElement>("[data-kl-gameplay]"));
        const risk = root.querySelector<HTMLElement>("[data-kl-copy='risk']");
        const climax = root.querySelector<HTMLElement>("[data-kl-copy='climax']");
        const closing = root.querySelector<HTMLElement>("[data-kl-copy='closing']");
        const standardAkari = root.querySelector<HTMLElement>("[data-kintsugi-asset='K01']");
        const transformedAkari = root.querySelector<HTMLElement>("[data-kintsugi-asset='K02']");
        const climaxAkari = root.querySelector<HTMLElement>("[data-kintsugi-asset='K13']");
        const broken = root.querySelector<HTMLElement>("[data-kintsugi-asset='K07']");
        const restored = root.querySelector<HTMLElement>("[data-kintsugi-asset='K08']");
        const moon = root.querySelector<HTMLElement>("[data-kintsugi-asset='K14']");
        const energy = root.querySelector<HTMLElement>("[data-kintsugi-asset='K06']");
        const fracture = root.querySelector<HTMLElement>("[data-kl-fracture]");
        const fracturePaths = Array.from(
          root.querySelectorAll<SVGPathElement>("[data-kl-fracture] path"),
        );
        const seam = root.querySelector<HTMLElement>("[data-kl-exit-seam]");
        const progress = root.querySelector<HTMLElement>("[data-kl-progress]");
        const relicArt = Array.from(root.querySelectorAll<HTMLElement>("[data-kl-relic-art]"));
        const gameplayArt = Array.from(root.querySelectorAll<HTMLElement>("[data-kl-gameplay-art]"));

        const narrative = [opening, awakening, transformation, complete, ...relics, ...gameplay, risk, climax, closing].filter(
          Boolean,
        ) as HTMLElement[];

        gsap.set(narrative, { autoAlpha: 0, y: 24 });
        gsap.set(opening, { autoAlpha: 1, y: 0 });
        gsap.set(transformedAkari, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" });
        gsap.set(climaxAkari, { autoAlpha: 0, scale: 1.04 });
        gsap.set(restored, { clipPath: "inset(0 100% 0 0)", autoAlpha: 0.25 });
        gsap.set(moon, { autoAlpha: 0, scale: 0.94 });
        gsap.set(energy, { autoAlpha: 0, scale: 1.05 });
        gsap.set(relicArt, { autoAlpha: 0, xPercent: 8, scale: 0.96 });
        gsap.set(gameplayArt, { autoAlpha: 0, scale: 1.04 });
        gsap.set(seam, { scaleX: 0, transformOrigin: "left center" });
        fracturePaths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });

        const hide = (element: HTMLElement | null, at: number) => {
          if (!element) return;
          timeline.to(element, { autoAlpha: 0, y: -18, duration: 2.4, ease: "power2.inOut" }, at);
        };
        const show = (element: HTMLElement | null, at: number) => {
          if (!element) return;
          timeline.fromTo(
            element,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 3, ease: "power3.out" },
            at,
          );
        };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.15,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              root.style.setProperty("--kl-progress", self.progress.toFixed(4));
              if (progress) progress.style.transform = `scaleY(${self.progress})`;
            },
          },
        });

        timeline.to({}, { duration: 100 });

        if (broken) {
          timeline.fromTo(
            broken,
            { filter: "brightness(.28) saturate(.55)", scale: 1.035 },
            { filter: "brightness(.52) saturate(.7)", scale: 1.015, duration: 15 },
            0,
          );
        }
        fracturePaths.forEach((path, index) => {
          timeline.to(
            path,
            {
              strokeDashoffset: 0,
              opacity: 0.42 + index * 0.08,
              duration: 10 + index * 1.2,
              ease: "power1.inOut",
            },
            2 + index * 0.7,
          );
        });
        hide(opening, 12);
        show(awakening, 15);

        if (energy) timeline.to(energy, { autoAlpha: 0.72, scale: 1, duration: 13 }, 15);
        if (fracture) {
          timeline.to(
            fracture,
            {
              filter: "drop-shadow(0 0 16px rgba(232, 197, 187, .48))",
              opacity: 1,
              duration: 12,
            },
            17,
          );
        }
        if (restored) {
          timeline.to(
            restored,
            { clipPath: "inset(0 46% 0 0)", autoAlpha: 0.72, duration: 12, ease: "power2.inOut" },
            18,
          );
        }
        hide(awakening, 27);
        show(transformation, 30);

        if (standardAkari) {
          timeline.fromTo(
            standardAkari,
            { autoAlpha: 0, yPercent: 5, scale: 0.98 },
            { autoAlpha: 1, yPercent: 0, scale: 1, duration: 7, ease: "power3.out" },
            27,
          );
          timeline.to(standardAkari, { autoAlpha: 0.18, filter: "brightness(.58) saturate(.7)", duration: 14 }, 39);
        }
        if (transformedAkari) {
          timeline.to(
            transformedAkari,
            { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", duration: 16, ease: "power2.inOut" },
            35,
          );
        }
        if (moon) timeline.to(moon, { autoAlpha: 0.72, scale: 1, duration: 13 }, 39);
        if (restored) timeline.to(restored, { clipPath: "inset(0 0% 0 0)", autoAlpha: 0.82, duration: 13 }, 39);
        hide(transformation, 43);
        show(complete, 45);
        hide(complete, 53);

        relics.forEach((relic, index) => {
          const at = 55 + index * 4.8;
          show(relic, at);
          if (index > 0) hide(relics[index - 1], at - 0.8);
          const art = relicArt[index];
          if (art) {
            timeline.fromTo(
              art,
              { autoAlpha: 0, xPercent: 8, scale: 0.96 },
              { autoAlpha: 1, xPercent: 0, scale: 1, duration: 2.8, ease: "power3.out" },
              at,
            );
            timeline.to(art, { autoAlpha: index === relics.length - 1 ? 0.2 : 0, duration: 1.8 }, at + 3.4);
          }
        });
        hide(relics[relics.length - 1] ?? null, 69);

        gameplay.forEach((pillar, index) => {
          const at = 70 + index * 4.3;
          show(pillar, at);
          if (index > 0) hide(gameplay[index - 1], at - 0.7);
          const art = gameplayArt[index];
          if (art) {
            timeline.fromTo(
              art,
              { autoAlpha: 0, scale: 1.04 },
              { autoAlpha: 0.92, scale: 1, duration: 2.7, ease: "power2.out" },
              at,
            );
            timeline.to(art, { autoAlpha: 0, duration: 1.4 }, at + 3.2);
          }
        });
        hide(gameplay[gameplay.length - 1] ?? null, 87);

        show(risk, 88);
        if (energy) timeline.to(energy, { autoAlpha: 0.24, duration: 4 }, 88);
        if (moon) timeline.to(moon, { autoAlpha: 0.9, filter: "saturate(1.18) brightness(.78)", duration: 6 }, 89);
        hide(risk, 94);

        show(climax, 95);
        if (standardAkari) timeline.to(standardAkari, { autoAlpha: 0, duration: 2 }, 94);
        if (transformedAkari) timeline.to(transformedAkari, { autoAlpha: 0.18, duration: 2 }, 94);
        if (climaxAkari) timeline.to(climaxAkari, { autoAlpha: 1, scale: 1, duration: 4, ease: "power3.out" }, 94);
        if (restored) timeline.to(restored, { autoAlpha: 1, filter: "brightness(.72) saturate(.92)", duration: 4 }, 95);
        if (seam) timeline.to(seam, { scaleX: 1, duration: 3.4, ease: "power2.inOut" }, 97);
        hide(climax, 98);
        show(closing, 98.2);
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        root.dataset.reducedMotion = "true";
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      media.revert();
      context.revert();
      root.style.removeProperty("--kl-progress");
      delete root.dataset.reducedMotion;
    };
  }, [rootRef]);
}
