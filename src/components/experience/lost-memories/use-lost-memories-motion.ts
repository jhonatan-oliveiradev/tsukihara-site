"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLostMemoriesMotion(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(max-width: 900px)", () => {
      const ctx = gsap.context(() => {
        const introParts = root.querySelectorAll<HTMLElement>("[data-archive-intro-part]");
        gsap.fromTo(introParts, { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-archive-intro]", start: "top 82%", once: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-archive-reveal]", root).forEach((header) => {
          gsap.fromTo(header, { opacity: 0, y: 12 }, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: header, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-archive-surface]", root).forEach((surface, index) => {
          gsap.fromTo(surface, { opacity: 0.72, y: index % 2 === 0 ? 14 : 10 }, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: "power2.out",
            scrollTrigger: { trigger: surface, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-archive-kind="photograph"]', root).forEach((photo) => {
          const glass = photo.querySelector<HTMLElement>(".ix-archive-item__glass");
          if (!glass) return;
          gsap.fromTo(glass, { xPercent: -65, opacity: 0 }, {
            xPercent: 80,
            opacity: 0.55,
            duration: 1.3,
            ease: "power2.inOut",
            scrollTrigger: { trigger: photo, start: "top 86%", once: true },
          });
        });

        const thesis = root.querySelector<HTMLElement>(".ix-archive-thesis");
        if (thesis) {
          const lines = thesis.querySelectorAll<HTMLElement>("[data-archive-thesis]");
          gsap.fromTo(lines, { opacity: 0, y: 18 }, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.34,
            ease: "power3.out",
            scrollTrigger: { trigger: thesis, start: "top 80%", once: true },
          });
        }

        const fragments = root.querySelector<HTMLElement>("[data-archive-fragments]");
        const akari = root.querySelector<HTMLElement>("[data-archive-akari]");
        if (fragments && akari) {
          gsap.fromTo(fragments, { opacity: 0.3, yPercent: 0 }, {
            opacity: 0.04,
            yPercent: -5,
            ease: "none",
            scrollTrigger: { trigger: akari, start: "top 92%", end: "center 45%", scrub: 1.2 },
          });
        }

        if (akari) {
          gsap.fromTo(akari, { opacity: 0, y: 14 }, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: akari, start: "top 82%", once: true },
          });
        }
      }, root);

      return () => ctx.revert();
    });

    const transitionCtx = gsap.context(() => {
      const transition = root.querySelector<HTMLElement>("[data-archive-transition]");
      if (!transition) return;
      const words = transition.querySelectorAll<HTMLElement>(".ix-archive-transition__word");

      gsap.fromTo(transition, { opacity: 0.45 }, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: transition, start: "top 88%", once: true },
      });
      gsap.fromTo(words, { opacity: 0, x: (index) => (index === 0 ? -18 : 18) }, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: transition, start: "top 78%", once: true },
      });
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      transitionCtx.revert();
      media.revert();
    };
  }, [rootRef]);
}
