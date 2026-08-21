"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HERO_BREAKPOINTS,
  HERO_SCROLL_DISTANCE,
} from "@/components/experience/hero/constants/hero-scene";

const getScrollDistance = (reduced: boolean) => {
  if (reduced) return HERO_SCROLL_DISTANCE.reduced;
  if (window.innerWidth <= HERO_BREAKPOINTS.mobile) return HERO_SCROLL_DISTANCE.mobile;
  if (window.innerWidth <= HERO_BREAKPOINTS.tablet) return HERO_SCROLL_DISTANCE.tablet;
  return HERO_SCROLL_DISTANCE.desktop;
};

export function useHeroTimeline(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia(`(max-width: ${HERO_BREAKPOINTS.mobile}px)`);
    const shell = root.closest<HTMLElement>(".ix-shell");
    const reduced = reducedQuery.matches;

    const ctx = gsap.context(() => {
      const afterStates = gsap.utils.toArray<HTMLElement>(".th-hero-state-after");
      const beforeStates = [
        "[data-moon-before]",
        "[data-mist-before]",
        "[data-temple-before]",
        "[data-ground-before]",
        "[data-characters-before]",
        "[data-sakura-right-before]",
      ];

      gsap.set(afterStates, { opacity: 0 });
      gsap.set("[data-mist-crimson]", { opacity: 0 });
      gsap.set("[data-crimson-wash]", { opacity: 0 });
      gsap.set("[data-character-rim]", { opacity: 0 });
      gsap.set("[data-ground-glow]", { opacity: 0 });
      gsap.set("[data-temple-light]", { opacity: 0 });
      gsap.set("[data-moon-halo-crimson]", { opacity: 0 });
      gsap.set("[data-right-petals-after]", { opacity: 0 });
      gsap.set("[data-sakura-left]", { opacity: 0.38 });
      gsap.set("[data-characters-before], [data-characters-after]", {
        xPercent: 12,
        yPercent: 3,
        scale: 0.965,
        transformOrigin: "70% 85%",
      });
      gsap.set("[data-moon-shadow]", { xPercent: -128, opacity: 0 });

      const ambient = gsap.timeline({ repeat: -1, yoyo: true });
      if (!reduced) {
        ambient
          .to("[data-mist-before], [data-mist-after]", {
            xPercent: 1.4,
            yPercent: -0.5,
            duration: 10,
            ease: "sine.inOut",
          })
          .to(
            "[data-mist-crimson]",
            { xPercent: -1.1, yPercent: 0.7, duration: 12, ease: "sine.inOut" },
            0,
          );
      }

      const petalTweens: gsap.core.Tween[] = [];
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>("[data-petal]").forEach((petal, index) => {
          const fromLeft = petal.dataset.side === "left";
          const band = petal.dataset.petal ?? "mid";
          const distance = band === "front" ? 66 : band === "mid" ? 58 : 50;
          const duration = band === "front" ? 7.5 : band === "mid" ? 10.5 : 14;
          const direction = fromLeft ? 1 : -1;
          const tween = gsap.to(petal, {
            keyframes: [
              { x: `${direction * distance * 0.52}vw`, y: -28 - (index % 4) * 9, rotation: direction * 125, opacity: 0.78 },
              { x: `${direction * distance * 0.82}vw`, y: -8 + (index % 5) * 8, rotation: direction * 245, opacity: 0.9 },
              { x: `${direction * distance}vw`, y: 22 - (index % 3) * 12, rotation: direction * 390, opacity: 0 },
            ],
            duration,
            delay: -((index * 0.71) % duration),
            repeat: -1,
            ease: "sine.inOut",
          });
          petalTweens.push(tween);
        });
      }

      const timeline = gsap.timeline({ defaults: { ease: "none" } });

      if (reduced) {
        timeline
          .to("[data-sky-crimson]", { opacity: 1, duration: 0.72 }, 0.14)
          .to(afterStates, { opacity: 1, duration: 0.72 }, 0.14)
          .to(beforeStates, { opacity: 0.14, duration: 0.72 }, 0.14)
          .to("[data-mist-crimson]", { opacity: 0.58, duration: 0.55 }, 0.3)
          .to("[data-moon-halo-normal]", { opacity: 0.1, duration: 0.55 }, 0.24)
          .to("[data-moon-halo-crimson]", { opacity: 0.92, duration: 0.55 }, 0.3)
          .to("[data-crimson-wash]", { opacity: 0.18, duration: 0.45 }, 0.42);
      } else {
        timeline
          // 0–12% — Serenity / character arrival.
          .to("[data-characters-before], [data-characters-after]", {
            xPercent: -0.8,
            yPercent: -0.3,
            scale: 1.004,
            duration: 0.095,
            ease: "power2.out",
          }, 0.01)
          .to("[data-characters-before], [data-characters-after]", {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: 0.035,
            ease: "sine.out",
          }, 0.095)
          // 12–28% — Omen.
          .to("[data-moon-halo-normal]", { opacity: 0.6, scale: 0.95, duration: 0.16 }, 0.12)
          .to("[data-hero-stars]", { opacity: 0.42, duration: 0.16 }, 0.12)
          .to("[data-petal-sheet-left]", { xPercent: 2.5, yPercent: -1, duration: 0.16 }, 0.12)
          // 28–48% — Eclipse begins.
          .to("[data-moon-shadow]", { xPercent: 2, opacity: 0.88, duration: 0.28, ease: "power1.inOut" }, 0.25)
          .to("[data-moon-after]", { opacity: 0.58, duration: 0.22 }, 0.29)
          .to("[data-moon-before]", { opacity: 0.6, duration: 0.22 }, 0.29)
          .to("[data-sky-crimson]", { opacity: 0.52, duration: 0.24 }, 0.28)
          .to("[data-temple-after]", { opacity: 0.52, duration: 0.25 }, 0.31)
          .to("[data-temple-before]", { opacity: 0.68, duration: 0.25 }, 0.31)
          .to("[data-mist-after]", { opacity: 0.58, duration: 0.22 }, 0.3)
          .to("[data-mist-before]", { opacity: 0.7, duration: 0.22 }, 0.3)
          .to("[data-sakura-right-after]", { opacity: 0.5, duration: 0.22 }, 0.32)
          .to("[data-sakura-right-before]", { opacity: 0.72, duration: 0.22 }, 0.32)
          // 48–68% — Kintsugi awakens.
          .to("[data-hero-camera]", { xPercent: -0.8, yPercent: -0.45, scale: 1.026, duration: 0.2, transformOrigin: "62% 54%" }, 0.48)
          .to("[data-moon-after]", { opacity: 1, duration: 0.2 }, 0.48)
          .to("[data-moon-before]", { opacity: 0.18, duration: 0.2 }, 0.48)
          .to("[data-moon-halo-normal]", { opacity: 0.08, duration: 0.18 }, 0.48)
          .to("[data-moon-halo-crimson]", { opacity: 1, scale: 1.06, duration: 0.2 }, 0.48)
          .to("[data-temple-after]", { opacity: 0.9, duration: 0.2 }, 0.48)
          .to("[data-temple-before]", { opacity: 0.24, duration: 0.2 }, 0.48)
          .to("[data-ground-after]", { opacity: 0.86, duration: 0.2 }, 0.49)
          .to("[data-ground-before]", { opacity: 0.28, duration: 0.2 }, 0.49)
          .to("[data-characters-after]", { opacity: 0.82, duration: 0.18 }, 0.5)
          .to("[data-characters-before]", { opacity: 0.42, duration: 0.18 }, 0.5)
          .to("[data-character-rim], [data-ground-glow], [data-temple-light]", { opacity: 0.72, duration: 0.18 }, 0.5)
          .to("[data-mist-crimson]", { opacity: 0.64, duration: 0.18 }, 0.49)
          .to("[data-right-petals-after], [data-left-petals-after]", { opacity: 0.86, duration: 0.18 }, 0.5)
          .to("[data-sakura-left]", { opacity: 0.78, duration: 0.16 }, 0.52)
          // 68–86% — Crimson dominion.
          .to("[data-sky-crimson]", { opacity: 1, duration: 0.18 }, 0.68)
          .to("[data-temple-after], [data-ground-after], [data-characters-after], [data-sakura-right-after]", { opacity: 1, duration: 0.18 }, 0.68)
          .to("[data-temple-before], [data-ground-before], [data-characters-before], [data-sakura-right-before], [data-mist-before]", { opacity: 0.08, duration: 0.18 }, 0.68)
          .to("[data-mist-after]", { opacity: 0.86, duration: 0.18 }, 0.68)
          .to("[data-crimson-wash]", { opacity: 0.24, duration: 0.18 }, 0.68)
          .to("[data-petal-vortex]", { scale: 1.025, rotation: -0.35, duration: 0.18, transformOrigin: "50% 52%" }, 0.68)
          // 86–100% — settle and hold the final key visual.
          .to("[data-hero-camera]", { xPercent: -0.45, yPercent: -0.2, scale: 1.021, duration: 0.14, ease: "sine.out" }, 0.86)
          .to("[data-petal-vortex]", { scale: 1, rotation: 0, duration: 0.14, ease: "sine.out" }, 0.86)
          .to("[data-crimson-wash]", { opacity: 0.17, duration: 0.14 }, 0.86);
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * getScrollDistance(reduced))}`,
        pin: root,
        pinSpacing: true,
        scrub: reduced ? 0.45 : 1.05,
        animation: timeline,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: ({ isActive }) => shell?.classList.toggle("th-hero-is-pinned", isActive),
        onUpdate: ({ progress }) => {
          root.dataset.heroProgress = progress.toFixed(3);
          const speed = progress < 0.12 ? 0.58 : progress < 0.48 ? 0.82 : progress < 0.86 ? 1.5 : 0.72;
          petalTweens.forEach((tween) => tween.timeScale(speed));
        },
      });

      if (!reduced && !pointerQuery.matches) {
        const planes = gsap.utils.toArray<HTMLElement>("[data-hero-plane]");
        const pointerTargets = planes.map((plane) => {
          const target = plane.querySelector<HTMLElement>("[data-hero-pointer-plane]");
          const depth = Number(plane.dataset.depth ?? 0);
          return target
            ? {
                x: gsap.quickTo(target, "x", { duration: 0.75, ease: "power3.out" }),
                y: gsap.quickTo(target, "y", { duration: 0.75, ease: "power3.out" }),
                depth,
              }
            : null;
        });

        const onPointerMove = (event: PointerEvent) => {
          const nx = (event.clientX / window.innerWidth) * 2 - 1;
          const ny = (event.clientY / window.innerHeight) * 2 - 1;
          pointerTargets.forEach((target) => {
            if (!target) return;
            target.x(nx * target.depth * 24);
            target.y(ny * target.depth * 14);
          });
        };
        const resetPointer = () => pointerTargets.forEach((target) => {
          target?.x(0);
          target?.y(0);
        });

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", resetPointer, { passive: true });
        ctx.add(() => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerleave", resetPointer);
        });
      }

      ctx.add(() => {
        trigger.kill();
        ambient.kill();
        petalTweens.forEach((tween) => tween.kill());
        shell?.classList.remove("th-hero-is-pinned");
        delete root.dataset.heroProgress;
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [rootRef]);
}
