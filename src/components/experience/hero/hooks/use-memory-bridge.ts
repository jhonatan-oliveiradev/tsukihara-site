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

    const getScrollBounds = (startRatio: number) => {
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      return {
        start: rootTop + travel * startRatio,
        end: rootTop + travel,
      };
    };

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
        start: () => getScrollBounds(0.82).start,
        end: () => getScrollBounds(0.82).end,
        onUpdate: ({ progress }) => {
          gsap.set(bridge, { autoAlpha: 1 });
          gsap.set([...eyebrow, ...jp, ...glyphs], {
            autoAlpha: progress < 0.72 ? 1 : 0,
            y: 0,
            scale: 1,
            filter: "none",
          });
          gsap.set(temple, {
            autoAlpha:
              progress < 0.76
                ? 0.42
                : Math.max(0, 0.42 * (1 - (progress - 0.76) / 0.2)),
            scale: 1.035,
            clipPath: "inset(0% 0% 0% 0% round 0%)",
          });
        },
        onLeaveBack: () => gsap.set(bridge, { autoAlpha: 0 }),
        invalidateOnRefresh: true,
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
          autoAlpha: 0.5,
          scale: 1.035,
          clipPath: "inset(0% 0% 0% 0% round 0%)",
          duration: 0.38,
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
        temple,
        {
          autoAlpha: 0,
          scale: 1.065,
          filter: "blur(2.5px)",
          duration: 0.2,
          ease: "power2.in",
        },
        0.76,
      )
      .to(haze, { autoAlpha: 0.28, xPercent: 8, duration: 0.22 }, 0.78)
      .to(
        ashes,
        {
          autoAlpha: 0.14,
          y: (index) => -108 - (index % 5) * 9,
          x: (index) => ((index % 7) - 3) * 24,
          duration: 0.22,
          stagger: { each: 0.004, from: "random" },
          ease: "power2.in",
        },
        0.78,
      );

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: () => getScrollBounds(0.7).start,
      end: () => getScrollBounds(0.7).end,
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
