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
      gsap.utils.toArray<HTMLElement>("[data-mm-eyebrow]").forEach((eyebrow) => {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, x: -12, letterSpacing: "0.36em" },
          {
            opacity: 1,
            x: 0,
            letterSpacing: "0.27em",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: eyebrow, start: "top 90%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mm-title]").forEach((title) => {
        const words = title.querySelectorAll<HTMLElement>("[data-mm-word]");
        gsap.fromTo(
          words,
          { yPercent: 118, opacity: 0.08 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.055,
            ease: "power4.out",
            scrollTrigger: { trigger: title, start: "top 86%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mm-title-block]").forEach((title) => {
        gsap.fromTo(
          title,
          { opacity: 0, y: 18, clipPath: "inset(0 0 42% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: title, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mm-body]").forEach((body) => {
        const paragraphs = body.querySelectorAll<HTMLElement>(":scope > p");
        gsap.fromTo(
          paragraphs,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.16,
            ease: "power2.out",
            scrollTrigger: { trigger: body, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mm-token]").forEach((token, index) => {
        gsap.fromTo(
          token,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: index * 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: token.parentElement ?? token,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mm-axiom]").forEach((axiom, index) => {
        gsap.fromTo(
          axiom,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: index * 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: axiom.parentElement ?? axiom,
              start: "top 89%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mm-subtitle]").forEach((subtitle) => {
        gsap.fromTo(
          subtitle,
          { opacity: 0, x: 18 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: subtitle, start: "top 86%", once: true },
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

      const identity = root.querySelector<HTMLElement>("[data-mm-identity]");
      if (identity) {
        const name = identity.querySelector<HTMLElement>("span");
        const signature = identity.querySelector<HTMLElement>("small");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: identity, start: "top 84%", once: true },
        });
        if (name) {
          timeline.fromTo(
            name,
            { opacity: 0, y: 20, letterSpacing: "0.015em" },
            { opacity: 1, y: 0, letterSpacing: "-0.035em", duration: 1.1, ease: "power3.out" },
          );
        }
        if (signature) {
          timeline.fromTo(
            signature,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            "-=0.35",
          );
        }
      }

      gsap.utils.toArray<HTMLElement>("[data-mm-quote]").forEach((quote) => {
        const words = quote.querySelectorAll<HTMLElement>("[data-mm-word]");
        const isTsukino = quote.dataset.mmQuote === "tsukino";
        gsap.fromTo(
          words,
          {
            yPercent: isTsukino ? 122 : 105,
            opacity: 0,
            letterSpacing: isTsukino ? "0.035em" : "0em",
          },
          {
            yPercent: 0,
            opacity: 1,
            letterSpacing: "0em",
            duration: isTsukino ? 1.25 : 0.9,
            stagger: isTsukino ? 0.07 : 0.045,
            ease: isTsukino ? "power4.out" : "power3.out",
            scrollTrigger: {
              trigger: quote,
              start: isTsukino ? "top 78%" : "top 84%",
              once: true,
            },
          },
        );
      });

      const akariQuote = root.querySelector<HTMLElement>('[data-mm-quote="akari"]');
      const tsukinoEcho = root.querySelector<HTMLElement>("[data-mm-tsukino-echo]");
      if (akariQuote && tsukinoEcho) {
        gsap.fromTo(
          tsukinoEcho,
          { opacity: 0.085, xPercent: -2, scale: 1.015 },
          {
            opacity: 0.008,
            xPercent: -8,
            scale: 1.065,
            ease: "none",
            scrollTrigger: {
              trigger: akariQuote,
              start: "top 94%",
              end: "bottom 34%",
              scrub: 1.25,
            },
          },
        );
      }

      const akariBranch = root.querySelector<HTMLElement>("[data-mm-akari-branch]");
      if (akariQuote && akariBranch) {
        const branchPaths = akariBranch.querySelectorAll<SVGPathElement>("[data-mm-branch-path]");
        const branchBlooms = akariBranch.querySelectorAll<SVGCircleElement>(
          "[data-mm-branch-bloom]",
        );

        gsap.set(branchPaths, { strokeDasharray: 1, strokeDashoffset: 1 });

        const branchTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: akariQuote,
            start: "top 88%",
            once: true,
          },
        });

        branchTimeline.fromTo(
          akariBranch,
          { opacity: 0, x: -18 },
          { opacity: 0.56, x: 0, duration: 0.58, ease: "power2.out" },
        );
        branchTimeline.to(
          branchPaths,
          { strokeDashoffset: 0, duration: 1.18, stagger: 0.085, ease: "power2.out" },
          "-=0.42",
        );
        branchTimeline.fromTo(
          branchBlooms,
          { opacity: 0, scale: 0.35 },
          { opacity: 0.72, scale: 1, duration: 0.46, stagger: 0.08, ease: "back.out(1.6)" },
          "-=0.38",
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-mm-side]").forEach((side) => {
        const direction = side.dataset.mmSide === "forget" ? -1 : 1;
        const titleWords = side.querySelectorAll<HTMLElement>(
          "[data-mm-side-title] [data-mm-word]",
        );
        const terms = side.querySelectorAll<HTMLElement>("[data-mm-term]");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: side, start: "top 82%", once: true },
        });
        timeline.fromTo(
          titleWords,
          { x: direction * 28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.95, stagger: 0.06, ease: "power3.out" },
        );
        timeline.fromTo(
          terms,
          { x: direction * 14, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.62, stagger: 0.11, ease: "power2.out" },
          "-=0.42",
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

      const closing = root.querySelector<HTMLElement>("[data-mm-closing]");
      const closingVisual = root.querySelector<HTMLElement>("[data-mm-closing-visual]");
      if (closing && closingVisual) {
        gsap.fromTo(
          closingVisual,
          { scale: 1.025, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: closing,
              start: "top bottom",
              end: "center 50%",
              scrub: 1.2,
            },
          },
        );

        const lines = closing.querySelectorAll<HTMLElement>("[data-mm-closing-line]");
        const signature = closing.querySelector<HTMLElement>("[data-mm-closing-signature]");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: closing, start: "top 72%", once: true },
        });
        timeline.fromTo(
          lines,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.38, ease: "power3.out" },
        );
        if (signature) {
          timeline.fromTo(
            signature,
            { opacity: 0, y: 14, clipPath: "inset(0 0 46% 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
              ease: "power3.out",
            },
            "+=0.15",
          );
        }
      }
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [rootRef]);
}
