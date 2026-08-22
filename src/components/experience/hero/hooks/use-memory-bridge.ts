"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useMemoryBridge(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const select = gsap.utils.selector(root);
    const q = (selector: string) => select(selector) as HTMLElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bridge = q("[data-memory-bridge]");
    const temple = q("[data-memory-temple]");
    const haze = q("[data-memory-haze]");
    const glyphs = q("[data-memory-glyph]");
    const eyebrow = q("[data-memory-eyebrow]");
    const jp = q("[data-memory-jp]");
    const ashes = q("[data-memory-ash]");

    if (!bridge.length) return;

    gsap.set(bridge, { autoAlpha: 0 });
    gsap.set(temple, {
      autoAlpha: 0,
      scale: 1.055,
      clipPath: "inset(36% 27% 36% 27% round 48%)",
    });
    gsap.set(haze, { autoAlpha: 0, xPercent: -5 });
    gsap.set(eyebrow, { autoAlpha: 0, y: 8 });
    gsap.set(jp, { autoAlpha: 0, y: 6 });
    gsap.set(glyphs, {
      autoAlpha: 0,
      y: 26,
      scale: 0.82,
      filter: "blur(14px)",
    });
    gsap.set(ashes, { autoAlpha: 0, y: 20 });

    if (reduced) {
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "82% top",
        end: "bottom bottom",
        onEnter: () => {
          gsap.set(bridge, { autoAlpha: 1 });
          gsap.set(temple, {
            autoAlpha: 0.45,
            scale: 1.035,
            clipPath: "inset(0% 0% 0% 0% round 0%)",
          });
          gsap.set([...eyebrow, ...jp, ...glyphs], {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "none",
          });
        },
        onLeaveBack: () => gsap.set(bridge, { autoAlpha: 0 }),
      });

      return () => trigger.kill();
    }

    const timeline = gsap.timeline({ defaults: { ease: "none" } });

    timeline
      .to(bridge, { autoAlpha: 1, duration: 0.06 }, 0)
      .to(haze, { autoAlpha: 0.78, xPercent: 4, duration: 0.5, ease: "sine.inOut" }, 0.04)
      .to(
        ashes,
        {
          autoAlpha: 0.72,
          y: (index) => -42 - (index % 7) * 7,
          x: (index) => ((index % 5) - 2) * 14,
          rotation: (index) => ((index % 6) - 3) * 12,
          duration: 0.42,
          stagger: { each: 0.007, from: "random" },
          ease: "power1.out",
        },
        0.08,
      )
      .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.13)
      .to(
        glyphs,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.23,
          stagger: { each: 0.009, from: "center" },
          ease: "power3.out",
        },
        0.15,
      )
      .to(jp, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.28)
      .to(
        temple,
        {
          autoAlpha: 0.48,
          scale: 1.035,
          clipPath: "inset(0% 0% 0% 0% round 0%)",
          duration: 0.42,
          ease: "power2.inOut",
        },
        0.38,
      )
      .to(haze, { autoAlpha: 0.5, duration: 0.18 }, 0.55)
      .to(eyebrow, { autoAlpha: 0, y: -8, duration: 0.12 }, 0.7)
      .to(jp, { autoAlpha: 0, y: -6, duration: 0.12 }, 0.7)
      .to(
        glyphs,
        {
          autoAlpha: 0,
          y: -24,
          x: (index) => ((index % 7) - 3) * 5,
          scale: 0.92,
          filter: "blur(10px)",
          duration: 0.22,
          stagger: { each: 0.006, from: "edges" },
          ease: "power2.in",
        },
        0.72,
      )
      .to(
        ashes,
        {
          autoAlpha: 0,
          y: (index) => -92 - (index % 5) * 8,
          x: (index) => ((index % 7) - 3) * 22,
          duration: 0.26,
          stagger: { each: 0.004, from: "random" },
          ease: "power2.in",
        },
        0.72,
      )
      .to(temple, { autoAlpha: 0.58, scale: 1.035, duration: 0.28 }, 0.72);

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "70% top",
      end: "bottom bottom",
      scrub: 1.1,
      animation: timeline,
      invalidateOnRefresh: true,
    });

    return () => {
      trigger.kill();
      timeline.kill();
    };
  }, [rootRef]);
}
