"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useFinalJourneyMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-final-copy]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.45,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-final-epilogue]",
            start: "top 76%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-final-horizon]",
        { scale: 1.025, yPercent: 0 },
        {
          scale: 1,
          yPercent: -1.2,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-final-epilogue]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        },
      );

      gsap.fromTo(
        "[data-final-characters]",
        { yPercent: 1.2, scale: 1.012 },
        {
          yPercent: -2.2,
          scale: 0.985,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-final-epilogue]",
            start: "top 88%",
            end: "bottom 20%",
            scrub: 1.7,
          },
        },
      );

      gsap.fromTo(
        "[data-final-atmosphere]",
        { opacity: 0.48, xPercent: -0.8 },
        {
          opacity: 0.68,
          xPercent: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-final-epilogue]",
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        },
      );

      gsap.fromTo(
        "[data-final-horizon-copy]",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-final-horizon-copy]",
            start: "top 86%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-final-footer-content]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-final-footer]",
            start: "top 78%",
            once: true,
          },
        },
      );
    }, root);

    return () => context.revert();
  }, [rootRef]);
}
