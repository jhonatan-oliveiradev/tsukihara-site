"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_BREAKPOINTS } from "@/components/experience/hero/constants/hero-scene";
import { HERO_ECLIPSE_BEATS } from "@/components/experience/hero/hero-timeline-math";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const range = (progress: number, start: number, end: number) =>
  clamp01((progress - start) / (end - start));

export function useHeroTimeline(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const select = gsap.utils.selector(root);
    const q = (selector: string) => select(selector) as HTMLElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia(`(max-width: ${HERO_BREAKPOINTS.mobile}px)`).matches;
    const shell = root.closest<HTMLElement>(".ix-shell");
    const context = gsap.context(() => undefined, root);

    const before = q(
      "[data-moon-before], [data-mist-before], [data-temple-before], [data-ground-before], [data-characters-before], [data-sakura-right-before]",
    );
    const after = q(
      "[data-moon-after], [data-mist-after], [data-temple-after], [data-ground-after], [data-characters-after], [data-sakura-right-after]",
    );

    gsap.set(after, { opacity: 0 });
    gsap.set(before, { opacity: 1 });
    gsap.set(
      q(
        "[data-sakura-left], [data-mist-crimson], [data-crimson-wash], [data-character-rim], [data-ground-glow], [data-temple-light], [data-moon-halo-crimson], [data-right-petals-after], [data-left-petals-after]",
      ),
      { opacity: 0 },
    );
    gsap.set(q("[data-moon-shadow]"), { xPercent: -132, opacity: 0 });
    gsap.set(q("[data-copy-intro]"), { opacity: 1, y: 0 });
    gsap.set(q("[data-copy-omen], [data-copy-eclipse]"), { opacity: 0, y: 36 });
    gsap.set(q("[data-phase-serene]"), { opacity: 1 });
    gsap.set(q("[data-phase-omen], [data-phase-eclipse]"), { opacity: 0 });
    gsap.set(q("[data-kanji-eclipse]"), { opacity: 0, scale: 0.92 });
    gsap.set(q("[data-kanji-memory]"), { opacity: 0.11 });

    const ambientTweens: gsap.core.Tween[] = [];
    if (!reduced) {
      ambientTweens.push(
        gsap.to(q("[data-mist-before], [data-mist-after]"), {
          xPercent: 1.8,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(q("[data-sakura-right-before], [data-sakura-right-after]"), {
          rotation: 0.35,
          duration: 9,
          repeat: -1,
          yoyo: true,
          transformOrigin: "88% 4%",
          ease: "sine.inOut",
        }),
      );
    }

    const petalTweens: gsap.core.Tween[] = [];
    if (!reduced) {
      q("[data-petal]").forEach((petal, index) => {
        const direction = petal.dataset.side === "left" ? 1 : -1;
        const band = petal.dataset.petal ?? "mid";
        const distance = band === "front" ? 62 : band === "mid" ? 48 : 36;
        const duration = band === "front" ? 8 : band === "mid" ? 11 : 15;
        petalTweens.push(
          gsap.to(petal, {
            x: `${direction * distance}vw`,
            y: 42 - (index % 5) * 18,
            rotation: direction * (260 + (index % 4) * 55),
            opacity: 0,
            duration,
            delay: -((index * 0.67) % duration),
            repeat: -1,
            ease: "sine.inOut",
          }),
        );
      });
    }

    const timeline = gsap.timeline({ defaults: { ease: "none" } });
    const contactAt = HERO_ECLIPSE_BEATS.contact;
    const crimsonAt = HERO_ECLIPSE_BEATS.crimson;

    if (reduced) {
      gsap.set(q("[data-hero-eclipse-curtain]"), { clipPath: "circle(0% at 67% 24%)" });
      gsap.set(q("[data-hero-blackout]"), { clipPath: "inset(100% 0 0 0)" });
    } else {
      timeline
        .to(
          q("[data-hero-camera]"),
          { scale: 1.012, xPercent: -0.2, yPercent: -0.12, duration: 0.16 },
          0,
        )
        .to(q("[data-moon-shadow]"), { xPercent: -54, opacity: 0.22, duration: 0.14 }, 0.24)
        .to(q("[data-sky-crimson]"), { opacity: 0.12, duration: 0.16 }, 0.24)
        .to(q("[data-moon-after]"), { opacity: 0.12, duration: 0.14 }, 0.3)
        .to(q("[data-temple-after], [data-mist-after]"), { opacity: 0.12, duration: 0.16 }, 0.3)
        .to(q("[data-copy-intro]"), { y: -28, opacity: 0, duration: 0.12 }, contactAt)
        .to(
          q("[data-copy-omen]"),
          { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" },
          contactAt,
        )
        .to(q("[data-phase-serene]"), { opacity: 0, duration: 0.12 }, contactAt)
        .to(q("[data-phase-omen]"), { opacity: 1, duration: 0.12 }, contactAt)
        .to(
          q("[data-moon-shadow]"),
          { xPercent: -4, opacity: 0.62, duration: 0.16, ease: "power1.inOut" },
          0.36,
        )
        .to(q("[data-moon-after]"), { opacity: 0.48, duration: 0.18 }, 0.38)
        .to(q("[data-moon-before]"), { opacity: 0.72, duration: 0.18 }, 0.38)
        .to(q("[data-sky-crimson]"), { opacity: 0.38, duration: 0.18 }, 0.38)
        .to(
          q("[data-temple-after], [data-mist-after], [data-sakura-right-after]"),
          { opacity: 0.4, duration: 0.18 },
          0.38,
        )
        .to(
          q("[data-temple-before], [data-mist-before], [data-sakura-right-before]"),
          { opacity: 0.78, duration: 0.18 },
          0.38,
        )
        .to(q("[data-kanji-memory]"), { opacity: 0.025, yPercent: -8, duration: 0.18 }, 0.5)
        .to(q("[data-kanji-eclipse]"), { opacity: 0.08, scale: 1, duration: 0.18 }, 0.52)
        .to(q("[data-moon-shadow]"), { xPercent: 34, opacity: 0.78, duration: 0.18 }, 0.5)
        .to(q("[data-moon-after]"), { opacity: 0.9, duration: 0.2 }, 0.5)
        .to(q("[data-moon-before]"), { opacity: 0.28, duration: 0.2 }, 0.5)
        .to(q("[data-moon-halo-normal]"), { opacity: 0.1, duration: 0.18 }, 0.5)
        .to(q("[data-moon-halo-crimson]"), { opacity: 0.92, scale: 1.05, duration: 0.2 }, 0.5)
        .to(
          q(
            "[data-temple-after], [data-ground-after], [data-characters-after], [data-sakura-right-after]",
          ),
          { opacity: 0.82, duration: 0.2 },
          0.5,
        )
        .to(
          q(
            "[data-temple-before], [data-ground-before], [data-characters-before], [data-sakura-right-before]",
          ),
          { opacity: 0.32, duration: 0.2 },
          0.5,
        )
        .to(q("[data-sakura-left], [data-mist-crimson]"), { opacity: 0.58, duration: 0.18 }, 0.52)
        .to(
          q("[data-character-rim], [data-ground-glow], [data-temple-light]"),
          { opacity: 0.65, duration: 0.18 },
          0.54,
        )
        .to(q("[data-crimson-wash]"), { opacity: 0.18, duration: 0.18 }, 0.56)
        .to(
          q("[data-left-petals-after], [data-right-petals-after]"),
          { opacity: 0.72, duration: 0.18 },
          0.58,
        )
        .to(q("[data-copy-omen]"), { y: -20, opacity: 0, duration: 0.12 }, crimsonAt - 0.04)
        .to(
          q("[data-copy-eclipse]"),
          { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" },
          crimsonAt,
        )
        .to(q("[data-phase-omen]"), { opacity: 0, duration: 0.12 }, crimsonAt - 0.04)
        .to(q("[data-phase-eclipse]"), { opacity: 1, duration: 0.12 }, crimsonAt)
        .to(q("[data-sky-crimson]"), { opacity: 0.94, duration: 0.18 }, 0.68)
        .to(after, { opacity: 1, duration: 0.18 }, 0.68)
        .to(before, { opacity: 0.06, duration: 0.18 }, 0.68)
        .to(q("[data-sakura-left]"), { opacity: 0.82, duration: 0.14 }, 0.68)
        .to(q("[data-mist-crimson]"), { opacity: 0.74, duration: 0.14 }, 0.68)
        .to(q("[data-crimson-wash]"), { opacity: 0.25, duration: 0.14 }, 0.68)
        .to(
          q("[data-hero-camera]"),
          { scale: 1.026, xPercent: -0.65, yPercent: -0.22, duration: 0.18 },
          0.68,
        )
        .to(
          q("[data-hero-word]"),
          { opacity: 0.42, letterSpacing: "-0.045em", duration: 0.16 },
          0.72,
        )
        .to(
          q("[data-hero-camera]"),
          { scale: 1.02, xPercent: -0.35, yPercent: -0.12, duration: 0.14, ease: "sine.out" },
          0.86,
        )
        .to(q("[data-crimson-wash]"), { opacity: 0.18, duration: 0.14 }, 0.86);

      timeline.duration(10);
      timeline
        .fromTo(
          q("[data-hero-blackout]"),
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 2.3, ease: "power2.inOut" },
          6.25,
        )
        .to(
          q("[data-copy-eclipse], [data-hero-plane]"),
          { autoAlpha: 0, filter: "blur(18px)", duration: 1.5 },
          5.9,
        )
        .fromTo(
          q("[data-hero-eclipse-curtain]"),
          { clipPath: "circle(0% at 67% 24%)" },
          { clipPath: "circle(150% at 67% 24%)", duration: 1.3 },
          6.5,
        )
        .to(
          q("[data-hero-eclipse-curtain]"),
          { clipPath: "circle(150% at 50% 50%)", duration: 0.7 },
          7.9,
        )
        .to(
          q("[data-hero-eclipse-curtain]"),
          { clipPath: "circle(0% at 50% 50%)", duration: 1.3 },
          8.8,
        );
      timeline
        .to(q("[data-petal-vortex]"), { autoAlpha: 0, duration: 0.8 }, 8.4)
        .to(
          q("[data-hero-word]"),
          { scale: 1.45, yPercent: -18, autoAlpha: 0, duration: 1.2 },
          8.35,
        )
        .to(
          q("[data-hero-blackout]"),
          { clipPath: "inset(0% 0 0 0)", duration: 2.4, ease: "none" },
          10.1,
        );
    }

    const trigger = reduced
      ? undefined
      : ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          animation: timeline,
          invalidateOnRefresh: true,
          onToggle: ({ isActive }) => shell?.classList.toggle("th-hero-is-pinned", isActive),
          onUpdate: ({ progress }) => {
            root.dataset.heroProgress = progress.toFixed(3);
            root.style.setProperty("--hero-progress", progress.toFixed(4));
            root.style.setProperty("--hero-omen", range(progress, 0.12, 0.48).toFixed(4));
            root.style.setProperty("--hero-eclipse", range(progress, 0.28, 0.78).toFixed(4));
            root.style.setProperty("--hero-storm", range(progress, 0.48, 0.86).toFixed(4));
            const speed =
              progress < 0.12 ? 0.55 : progress < 0.48 ? 0.85 : progress < 0.86 ? 1.45 : 0.72;
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
              x: gsap.quickTo(target, "x", { duration: 0.9, ease: "power3.out" }),
              y: gsap.quickTo(target, "y", { duration: 0.9, ease: "power3.out" }),
              depth,
            }
          : null;
      });

      const move = (event: PointerEvent) => {
        const nx = (event.clientX / window.innerWidth) * 2 - 1;
        const ny = (event.clientY / window.innerHeight) * 2 - 1;
        pointerTargets.forEach((target) => {
          if (!target) return;
          target.x(nx * target.depth * 14);
          target.y(ny * target.depth * 8);
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

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      removePointerListeners?.();
      trigger?.kill();
      timeline.kill();
      context.revert();
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
