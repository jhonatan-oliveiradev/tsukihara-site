"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FALLBACK_HEADER_HEIGHT = 72;

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

      const getHeaderOffset = () => {
        const header = document.querySelector<HTMLElement>(".ix-header");
        return Math.round(header?.getBoundingClientRect().height || FALLBACK_HEADER_HEIGHT);
      };

      const syncViewportMetrics = () => {
        viewport.style.setProperty("--archive-pin-offset", `${getHeaderOffset()}px`);
      };

      syncViewportMetrics();

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          id: "lost-memories-horizontal",
          trigger: viewport,
          start: () => `top ${getHeaderOffset()}px`,
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const trigger = tween.scrollTrigger;
      const anchorListeners: Array<() => void> = [];
      root
        .querySelectorAll<HTMLAnchorElement>('.ix-archive-index a[href^="#archive-"]')
        .forEach((anchor) => {
          const onClick = (event: MouseEvent) => {
            if (!trigger) return;
            const href = anchor.getAttribute("href");
            const panel = href ? root.querySelector<HTMLElement>(href) : null;
            if (!panel) return;

            event.preventDefault();
            const distance = getDistance();
            if (distance <= 0) return;

            const panelOffset =
              panel.getBoundingClientRect().left - track.getBoundingClientRect().left;
            const panelProgress = Math.min(1, Math.max(0, panelOffset / distance));
            const targetScroll = trigger.start + (trigger.end - trigger.start) * panelProgress;
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          };

          anchor.addEventListener("click", onClick);
          anchorListeners.push(() => anchor.removeEventListener("click", onClick));
        });

      window.addEventListener("resize", syncViewportMetrics, { passive: true });
      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        window.removeEventListener("resize", syncViewportMetrics);
        anchorListeners.forEach((remove) => remove());
        trigger?.kill();
        tween.kill();
        viewport.style.removeProperty("--archive-pin-offset");
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => media.revert();
  }, [rootRef]);
}
