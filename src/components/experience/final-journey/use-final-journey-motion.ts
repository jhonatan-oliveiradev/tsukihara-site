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

    let footerPointerFrame = 0;
    let footerCurrentX = 0;
    let footerCurrentY = 0;
    let footerTargetX = 0;
    let footerTargetY = 0;
    let footerPointerActive = false;

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
        ".ix-final-footer__hud",
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          stagger: 0.16,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-final-footer]",
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-final-footer-content]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-final-footer]",
            start: "top 74%",
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
              yPercent: 12 * depth,
              xPercent: direction * 3.2 * depth,
              scale: 1 + 0.052 * depth,
            },
            {
              yPercent: -8 * depth,
              xPercent: direction * -2.2 * depth,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: footer,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.85,
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

    const stopFooterPointerFrame = () => {
      if (footerPointerFrame) cancelAnimationFrame(footerPointerFrame);
      footerPointerFrame = 0;
    };

    const renderFooterPointer = () => {
      const ease = footerPointerActive ? 0.085 : 0.065;
      footerCurrentX += (footerTargetX - footerCurrentX) * ease;
      footerCurrentY += (footerTargetY - footerCurrentY) * ease;

      footerLayers.forEach((layer) => {
        const depth = Number(layer.dataset.footerDepth ?? "0.5");
        const xDepth = 3 + depth * 13;
        const yDepth = 2 + depth * 7;
        layer.style.translate = `${footerCurrentX * xDepth}px ${footerCurrentY * yDepth}px`;
      });

      const settled =
        Math.abs(footerTargetX - footerCurrentX) < 0.002 &&
        Math.abs(footerTargetY - footerCurrentY) < 0.002;

      if (!settled || footerPointerActive) {
        footerPointerFrame = requestAnimationFrame(renderFooterPointer);
      } else {
        footerPointerFrame = 0;
      }
    };

    const ensureFooterPointerFrame = () => {
      if (!footerPointerFrame) footerPointerFrame = requestAnimationFrame(renderFooterPointer);
    };

    const onFooterPointerMove = (event: PointerEvent) => {
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      footerTargetX = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      );
      footerTargetY = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
      );
      footerPointerActive = true;
      ensureFooterPointerFrame();
    };

    const onFooterPointerLeave = () => {
      footerTargetX = 0;
      footerTargetY = 0;
      footerPointerActive = false;
      ensureFooterPointerFrame();
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

    if (finePointer && footer && footerLayers.length > 0) {
      footer.addEventListener("pointermove", onFooterPointerMove, { passive: true });
      footer.addEventListener("pointerleave", onFooterPointerLeave);
    }

    return () => {
      context.revert();
      stopPointerFrame();
      stopFooterPointerFrame();
      epilogue?.removeEventListener("pointermove", onPointerMove);
      epilogue?.removeEventListener("pointerleave", onPointerLeave);
      footer?.removeEventListener("pointermove", onFooterPointerMove);
      footer?.removeEventListener("pointerleave", onFooterPointerLeave);
      pointerLayers.forEach(({ element }) => {
        element.style.translate = "";
      });
      footerLayers.forEach((element) => {
        element.style.translate = "";
      });
    };
  }, [rootRef]);
}
