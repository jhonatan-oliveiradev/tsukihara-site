"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PointerLayer = {
  element: HTMLElement;
  xDepth: number;
  yDepth: number;
};

export function useFinalJourneyMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const epilogue = root.querySelector<HTMLElement>("[data-final-epilogue]");
    const horizon = root.querySelector<HTMLElement>("[data-final-horizon]");
    const moon = root.querySelector<HTMLElement>("[data-final-moon]");
    const characters = root.querySelector<HTMLElement>("[data-final-characters]");
    const foreground = root.querySelector<HTMLElement>(".ix-final-layer--foreground");
    const atmosphere = root.querySelector<HTMLElement>("[data-final-atmosphere]");
    const footer = root.querySelector<HTMLElement>("[data-final-footer]");
    const footerLayers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-final-footer-layer]"),
    );

    let pointerFrame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerActive = false;
    let pointerLayers: PointerLayer[] = [];

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

      if (epilogue && horizon && moon && characters && foreground && atmosphere) {
        const scenery = gsap.timeline({
          scrollTrigger: {
            trigger: epilogue,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.45,
          },
        });

        scenery
          .fromTo(
            horizon,
            { scale: 1.08, xPercent: -1.8, yPercent: 2.2, opacity: 0.9 },
            {
              scale: 1.015,
              xPercent: 0,
              yPercent: -1.4,
              opacity: 0.86,
              duration: 0.7,
              ease: "none",
            },
            0,
          )
          .to(
            horizon,
            {
              scale: 1,
              xPercent: 1.1,
              yPercent: -2.8,
              opacity: 0.66,
              duration: 0.3,
              ease: "none",
            },
            0.7,
          )
          .fromTo(
            moon,
            { scale: 1.04, xPercent: 2.2, yPercent: 1.2, opacity: 0.62 },
            {
              scale: 1,
              xPercent: -0.8,
              yPercent: -1,
              opacity: 0.8,
              duration: 0.7,
              ease: "none",
            },
            0,
          )
          .to(
            moon,
            {
              scale: 0.94,
              xPercent: -2.8,
              yPercent: -2.2,
              opacity: 0.9,
              duration: 0.3,
              ease: "none",
            },
            0.7,
          )
          .fromTo(
            characters,
            { scale: 1.075, xPercent: -0.5, yPercent: 3, opacity: 0.98 },
            {
              scale: 0.965,
              xPercent: 1.8,
              yPercent: -2.5,
              opacity: 0.9,
              duration: 0.7,
              ease: "none",
            },
            0,
          )
          .to(
            characters,
            {
              scale: 0.79,
              xPercent: 4.8,
              yPercent: -9,
              opacity: 0.46,
              duration: 0.3,
              ease: "none",
            },
            0.7,
          )
          .fromTo(
            foreground,
            { scale: 1.045, xPercent: -3.2, yPercent: -0.8, opacity: 0.94 },
            {
              scale: 1,
              xPercent: 1.4,
              yPercent: 3.8,
              opacity: 0.75,
              duration: 0.7,
              ease: "none",
            },
            0,
          )
          .to(
            foreground,
            {
              scale: 0.98,
              xPercent: 7,
              yPercent: 16,
              opacity: 0.18,
              duration: 0.3,
              ease: "none",
            },
            0.7,
          )
          .fromTo(
            atmosphere,
            { xPercent: -4.5, yPercent: 1.4, opacity: 0.42 },
            {
              xPercent: 1,
              yPercent: -1.2,
              opacity: 0.68,
              duration: 0.7,
              ease: "none",
            },
            0,
          )
          .to(
            atmosphere,
            {
              xPercent: 7,
              yPercent: -4.5,
              opacity: 0.18,
              duration: 0.3,
              ease: "none",
            },
            0.7,
          );
      }

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

      if (footer && footerLayers.length > 0) {
        footerLayers.forEach((layer, index) => {
          const depth = Number(layer.dataset.footerDepth ?? "0.5");
          const direction = index % 2 === 0 ? -1 : 1;

          gsap.fromTo(
            layer,
            {
              yPercent: 10 * depth,
              xPercent: direction * 2.8 * depth,
              scale: 1 + 0.045 * depth,
            },
            {
              yPercent: -7 * depth,
              xPercent: direction * -1.8 * depth,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: footer,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.9,
              },
            },
          );
        });
      }
    }, root);

    const finePointer = window.matchMedia("(min-width: 901px) and (pointer: fine)").matches;

    const stopPointerFrame = () => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    };

    const renderPointer = () => {
      const ease = pointerActive ? 0.105 : 0.075;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      pointerLayers.forEach(({ element, xDepth, yDepth }) => {
        element.style.translate = `${currentX * xDepth}px ${currentY * yDepth}px`;
      });

      const settled = Math.abs(targetX - currentX) < 0.002 && Math.abs(targetY - currentY) < 0.002;
      if (!settled || pointerActive) {
        pointerFrame = requestAnimationFrame(renderPointer);
      } else {
        pointerFrame = 0;
      }
    };

    const ensurePointerFrame = () => {
      if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!epilogue) return;
      const rect = epilogue.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      pointerActive = true;
      ensurePointerFrame();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      pointerActive = false;
      ensurePointerFrame();
    };

    if (finePointer && epilogue && horizon && moon && characters && foreground && atmosphere) {
      pointerLayers = [
        { element: horizon, xDepth: 2.5, yDepth: 1.5 },
        { element: moon, xDepth: -5.5, yDepth: -3.5 },
        { element: characters, xDepth: 8, yDepth: 4.5 },
        { element: foreground, xDepth: 16, yDepth: 9 },
        { element: atmosphere, xDepth: 12, yDepth: 6.5 },
      ];

      epilogue.addEventListener("pointermove", onPointerMove, { passive: true });
      epilogue.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      context.revert();
      stopPointerFrame();
      epilogue?.removeEventListener("pointermove", onPointerMove);
      epilogue?.removeEventListener("pointerleave", onPointerLeave);
      pointerLayers.forEach(({ element }) => {
        element.style.translate = "";
      });
    };
  }, [rootRef]);
}
