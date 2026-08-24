"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLostMemoriesHorizontal(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const viewport = root.querySelector<HTMLElement>("[data-archive-horizontal]");
      const track = root.querySelector<HTMLElement>("[data-archive-horizontal-track]");
      if (!viewport || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          id: "lost-memories-horizontal",
          trigger: viewport,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const trigger = tween.scrollTrigger;
      const anchorListeners: Array<() => void> = [];
      root.querySelectorAll<HTMLAnchorElement>('.ix-archive-index a[href^="#archive-"]').forEach((anchor) => {
        const onClick = (event: MouseEvent) => {
          if (!trigger) return;
          const href = anchor.getAttribute("href");
          const panel = href ? root.querySelector<HTMLElement>(href) : null;
          if (!panel) return;

          event.preventDefault();
          const distance = getDistance();
          if (distance <= 0) return;

          const panelOffset = panel.getBoundingClientRect().left - track.getBoundingClientRect().left;
          const panelProgress = Math.min(1, Math.max(0, panelOffset / distance));
          const targetScroll = trigger.start + (trigger.end - trigger.start) * panelProgress;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        };

        anchor.addEventListener("click", onClick);
        anchorListeners.push(() => anchor.removeEventListener("click", onClick));
      });

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        window.cancelAnimationFrame(refreshFrame);
        anchorListeners.forEach((remove) => remove());
        trigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => media.revert();
  }, [rootRef]);
}
