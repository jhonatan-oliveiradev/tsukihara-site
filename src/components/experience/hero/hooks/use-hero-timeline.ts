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

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const range = (progress: number, start: number, end: number) =>
  clamp01((progress - start) / (end - start));

export function useHeroTimeline(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const select = gsap.utils.selector(root);
    const q = (selector: string) => select(selector) as HTMLElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia(`(max-width: ${HERO_BREAKPOINTS.mobile}px)`).matches;
    const shell = root.closest<HTMLElement>(".ix-shell");

    const beforeEnvironment = q(
      "[data-mist-before], [data-temple-before], [data-ground-before], [data-characters-before], [data-sakura-right-before]",
    );
    const afterEnvironment = q(
      "[data-mist-after], [data-temple-after], [data-ground-after], [data-characters-after], [data-sakura-right-after]",
    );

    gsap.set(q("[data-moon-before]"), { opacity: 1 });
    gsap.set(q("[data-moon-after]"), { opacity: 0 });
    gsap.set(beforeEnvironment, { opacity: 1 });
    gsap.set(afterEnvironment, { opacity: 0 });
    gsap.set(
      q(
        "[data-sakura-left], [data-mist-crimson], [data-crimson-wash], [data-character-rim], [data-ground-glow], [data-temple-light], [data-moon-halo-crimson], [data-right-petals-after], [data-left-petals-after]",
      ),
      { opacity: 0 },
    );
    gsap.set(q("[data-moon-halo-normal]"), { opacity: 0.82, scale: 1 });
    gsap.set(q("[data-moon-shadow]"), { xPercent: -152, opacity: 0 });
    gsap.set(q("[data-copy-intro]"), { opacity: 1, y: 0 });
    gsap.set(q("[data-copy-omen], [data-copy-eclipse]"), { opacity: 0, y: 26 });
    gsap.set(q("[data-phase-serene]"), { opacity: 1 });
    gsap.set(q("[data-phase-omen], [data-phase-eclipse]"), { opacity: 0 });
    gsap.set(q("[data-kanji-memory]"), { opacity: 0.08, yPercent: 0 });
    gsap.set(q("[data-kanji-eclipse]"), { opacity: 0, scale: 0.96 });

    const ambientTweens: gsap.core.Tween[] = [];
    const petalTweens: gsap.core.Tween[] = [];

    if (!reduced) {
      ambientTweens.push(
        gsap.to(q("[data-mist-before], [data-mist-after]"), {
          xPercent: 1.35,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(q("[data-sakura-right-before], [data-sakura-right-after]"), {
          rotation: 0.22,
          duration: 11,
          repeat: -1,
          yoyo: true,
          transformOrigin: "92% 6%",
          ease: "sine.inOut",
        }),
      );

      q("[data-petal]").forEach((petal, index) => {
        const direction = petal.dataset.side === "left" ? 1 : -1;
        const band = petal.dataset.petal ?? "mid";
        const distance = band === "front" ? 42 : band === "mid" ? 32 : 24;
        const duration = band === "front" ? 10 : band === "mid" ? 13 : 17;
        petalTweens.push(
          gsap.to(petal, {
            x: `${direction * distance}vw`,
            y: 26 - (index % 5) * 13,
            rotation: direction * (210 + (index % 4) * 42),
            opacity: 0,
            duration,
            delay: -((index * 0.73) % duration),
            repeat: -1,
            ease: "sine.inOut",
          }),
        );
      });
    }

    const timeline = gsap.timeline({ defaults: { ease: "none" } });

    if (reduced) {
      timeline
        .to(q("[data-copy-intro]"), { opacity: 0, duration: 0.16 }, 0.46)
        .to(q("[data-copy-eclipse]"), { opacity: 1, y: 0, duration: 0.18 }, 0.5)
        .to(q("[data-moon-before]"), { opacity: 0, duration: 0.18 }, 0.48)
        .to(q("[data-moon-after]"), { opacity: 1, duration: 0.18 }, 0.5)
        .to(afterEnvironment, { opacity: 1, duration: 0.22 }, 0.5)
        .to(beforeEnvironment, { opacity: 0.08, duration: 0.22 }, 0.5)
        .to(q("[data-sky-crimson]"), { opacity: 0.84, duration: 0.22 }, 0.5)
        .to(
          q("[data-moon-halo-crimson], [data-crimson-wash], [data-character-rim]"),
          { opacity: 0.72, duration: 0.2 },
          0.5,
        );
    } else {
      timeline
        .to(q("[data-hero-camera]"), { scale: 1.008, yPercent: -0.08, duration: 0.18 }, 0)
        .to(q("[data-copy-intro]"), { y: -10, opacity: 0.7, duration: 0.09 }, 0.12)
        .to(q("[data-copy-intro]"), { y: -24, opacity: 0, duration: 0.08 }, 0.2)
        .to(q("[data-copy-omen]"), { y: 0, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.21)
        .to(q("[data-phase-serene]"), { opacity: 0, duration: 0.06 }, 0.19)
        .to(q("[data-phase-omen]"), { opacity: 1, duration: 0.06 }, 0.21)
        .to(q("[data-moon-shadow]"), { xPercent: -88, opacity: 1, duration: 0.08 }, 0.22)
        .to(q("[data-moon-shadow]"), { xPercent: -18, opacity: 1, duration: 0.12, ease: "sine.inOut" }, 0.3)
        .to(q("[data-moon-shadow]"), { xPercent: 34, opacity: 1, duration: 0.1, ease: "sine.inOut" }, 0.42)
        .to(q("[data-moon-shadow]"), { xPercent: 118, opacity: 0.9, duration: 0.1, ease: "sine.inOut" }, 0.52)
        .to(q("[data-moon-shadow]"), { xPercent: 154, opacity: 0, duration: 0.06 }, 0.62)
        .to(q("[data-sky-crimson]"), { opacity: 0.16, duration: 0.24 }, 0.28)
        .to(q("[data-moon-halo-normal]"), { opacity: 0.26, scale: 0.985, duration: 0.2 }, 0.34)
        .to(q("[data-copy-omen]"), { y: -18, opacity: 0, duration: 0.08 }, 0.52)
        .to(q("[data-copy-eclipse]"), { y: 0, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.57)
        .to(q("[data-phase-omen]"), { opacity: 0, duration: 0.06 }, 0.54)
        .to(q("[data-phase-eclipse]"), { opacity: 1, duration: 0.06 }, 0.58)
        .to(q("[data-moon-before]"), { opacity: 0, duration: 0.12 }, 0.57)
        .to(q("[data-moon-after]"), { opacity: 1, duration: 0.12 }, 0.59)
        .to(q("[data-moon-halo-crimson]"), { opacity: 0.9, scale: 1.04, duration: 0.14 }, 0.59)
        .to(q("[data-moon-halo-normal]"), { opacity: 0, duration: 0.1 }, 0.59)
        .to(q("[data-sky-crimson]"), { opacity: 0.9, duration: 0.2 }, 0.58)
        .to(afterEnvironment, { opacity: 0.9, duration: 0.18 }, 0.61)
        .to(beforeEnvironment, { opacity: 0.14, duration: 0.18 }, 0.61)
        .to(q("[data-sakura-left], [data-mist-crimson]"), { opacity: 0.6, duration: 0.18 }, 0.62)
        .to(q("[data-character-rim]"), { opacity: 0.68, duration: 0.16 }, 0.63)
        .to(q("[data-ground-glow], [data-temple-light]"), { opacity: 0.54, duration: 0.16 }, 0.64)
        .to(q("[data-crimson-wash]"), { opacity: 0.18, duration: 0.16 }, 0.65)
        .to(q("[data-left-petals-after], [data-right-petals-after]"), { opacity: 0.56, duration: 0.16 }, 0.66)
        .to(q("[data-kanji-memory]"), { opacity: 0.018, yPercent: -5, duration: 0.16 }, 0.6)
        .to(q("[data-kanji-eclipse]"), { opacity: 0.07, scale: 1, duration: 0.16 }, 0.62)
        .to(q("[data-hero-camera]"), { scale: 1.018, xPercent: -0.24, yPercent: -0.12, duration: 0.2 }, 0.66)
        .to(q("[data-hero-word]"), { opacity: 0.3, duration: 0.18 }, 0.7)
        .to(q("[data-crimson-wash]"), { opacity: 0.14, duration: 0.12 }, 0.88)
        .to(q("[data-hero-camera]"), { scale: 1.014, xPercent: -0.12, yPercent: -0.06, duration: 0.12, ease: "sine.out" }, 0.88);
    }

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * getScrollDistance(reduced))}`,
      pin: root,
      pinSpacing: true,
      scrub: reduced ? 0.2 : 1.05,
      animation: timeline,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: ({ isActive }) => shell?.classList.toggle("th-hero-is-pinned", isActive),
      onUpdate: ({ progress }) => {
        root.dataset.heroProgress = progress.toFixed(3);
        root.style.setProperty("--hero-progress", progress.toFixed(4));
        root.style.setProperty("--hero-omen", range(progress, 0.18, 0.5).toFixed(4));
        root.style.setProperty("--hero-eclipse", range(progress, 0.22, 0.64).toFixed(4));
        root.style.setProperty("--hero-storm", range(progress, 0.58, 0.86).toFixed(4));

        const speed = progress < 0.2 ? 0.42 : progress < 0.58 ? 0.72 : progress < 0.86 ? 1.12 : 0.58;
        petalTweens.forEach((tween) => tween.timeScale(speed));
      },
    });

    let removePointerListeners: (() => void) | undefined;

    if (!reduced && !mobile) {
      const pointerTargets = q("[data-hero-plane]").map((plane) => {
        const target = plane.querySelector<HTMLElement>("[data-hero-pointer-plane]");
        const depth = Number(plane.dataset.depth ?? 0);

        return target
          ? {
              x: gsap.quickTo(target, "x", { duration: 1.1, ease: "power3.out" }),
              y: gsap.quickTo(target, "y", { duration: 1.1, ease: "power3.out" }),
              depth,
            }
          : null;
      });

      const move = (event: PointerEvent) => {
        const nx = (event.clientX / window.innerWidth) * 2 - 1;
        const ny = (event.clientY / window.innerHeight) * 2 - 1;

        pointerTargets.forEach((target) => {
          if (!target) return;
          target.x(nx * target.depth * 9);
          target.y(ny * target.depth * 5);
        });
      };

      const reset = () =>
        pointerTargets.forEach((target) => {
          target?.x(0);
          target?.y(0);
        });

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerleave", reset, { passive: true });

      removePointerListeners = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerleave", reset);
      };
    }

    ScrollTrigger.refresh();

    return () => {
      removePointerListeners?.();
      trigger.kill();
      timeline.kill();
      ambientTweens.forEach((tween) => tween.kill());
      petalTweens.forEach((tween) => tween.kill());
      shell?.classList.remove("th-hero-is-pinned");
      delete root.dataset.heroProgress;
      root.style.removeProperty("--hero-progress");
      root.style.removeProperty("--hero-omen");
      root.style.removeProperty("--hero-eclipse");
      root.style.removeProperty("--hero-storm");
    };
  }, [rootRef]);
}
