"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useMotherMoonMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-mm-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 22, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      const forgetting = root.querySelector<HTMLElement>("[data-mm-forgetting-layer]");
      if (forgetting) {
        gsap.fromTo(
          forgetting,
          { clipPath: "inset(0 0 100% 0)", opacity: 0.2 },
          {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-mm-forgetting]",
              start: "top 76%",
              end: "bottom 42%",
              scrub: 1.4,
            },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-mm-presence-detail]").forEach((detail, index) => {
        gsap.fromTo(
          detail,
          { opacity: 0, y: 18, scale: 1.025 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            delay: index * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: detail,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      const divider = root.querySelector<HTMLElement>("[data-mm-divider]");
      if (divider) {
        gsap.fromTo(
          divider,
          { opacity: 0.25, scaleY: 0.86 },
          {
            opacity: 0.9,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-mm-philosophy]",
              start: "top 80%",
              end: "center 48%",
              scrub: 1.1,
            },
          },
        );
      }

      const closing = root.querySelector<HTMLElement>("[data-mm-closing-visual]");
      if (closing) {
        gsap.fromTo(
          closing,
          { scale: 1.025, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-mm-closing]",
              start: "top bottom",
              end: "center 50%",
              scrub: 1.2,
            },
          },
        );
      }
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [rootRef]);
}
