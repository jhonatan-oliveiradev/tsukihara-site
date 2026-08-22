"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AkariMosaicPin() {
  useLayoutEffect(() => {
    const stage = document.querySelector<HTMLElement>("[data-akari-details-stage]");
    const panel = stage?.querySelector<HTMLElement>(".akari-mosaic-layout");

    if (!stage || !panel) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(panel, {
        position: "relative",
        top: "auto",
      });

      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${Math.max(1, stage.offsetHeight - window.innerHeight)}`,
        pin: panel,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, stage);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return null;
}
