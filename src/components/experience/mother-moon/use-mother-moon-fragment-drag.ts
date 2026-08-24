"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

const DRAG_MEDIA_QUERY = "(min-width: 901px) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDragBounds(shell: HTMLElement, gallery: HTMLElement) {
  const shellRect = shell.getBoundingClientRect();
  const galleryRect = gallery.getBoundingClientRect();
  const visibleX = Math.min(112, Math.max(72, shellRect.width * 0.28));
  const visibleY = Math.min(112, Math.max(72, shellRect.height * 0.22));

  return {
    minX: galleryRect.left + visibleX - shellRect.right,
    maxX: galleryRect.right - visibleX - shellRect.left,
    minY: galleryRect.top + visibleY - shellRect.bottom,
    maxY: galleryRect.bottom - visibleY - shellRect.top,
  };
}

export function useMotherMoonFragmentDrag(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const gallery = root?.querySelector<HTMLElement>("[data-mm-presence-gallery]");
    if (!root || !gallery) return;

    const dragMedia = window.matchMedia(DRAG_MEDIA_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let disposeDrag: (() => void) | undefined;

    const setupDrag = () => {
      disposeDrag?.();
      disposeDrag = undefined;

      if (!dragMedia.matches) return;

      const shells = Array.from(
        gallery.querySelectorAll<HTMLElement>("[data-mm-presence-detail]"),
      );
      let stackIndex = shells.length + 1;
      const cleanups: Array<() => void> = [];

      shells.forEach((shell, index) => {
        const layer = shell.querySelector<HTMLElement>("[data-mm-fragment-drag]");
        if (!layer) return;

        shell.style.zIndex = String(index + 1);

        const xTo = gsap.quickTo(layer, "x", { duration: 0.16, ease: "power3.out" });
        const yTo = gsap.quickTo(layer, "y", { duration: 0.16, ease: "power3.out" });
        const rotationTo = gsap.quickTo(layer, "rotation", {
          duration: 0.2,
          ease: "power3.out",
        });

        let activePointerId: number | null = null;
        let startPointerX = 0;
        let startPointerY = 0;
        let startX = 0;
        let startY = 0;
        let targetX = 0;
        let targetY = 0;
        let lastPointerX = 0;
        let lastPointerY = 0;
        let lastPointerTime = 0;
        let velocityX = 0;
        let velocityY = 0;

        const onPointerDown = (event: PointerEvent) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;

          activePointerId = event.pointerId;
          layer.setPointerCapture(event.pointerId);
          gsap.killTweensOf(layer);

          startPointerX = event.clientX;
          startPointerY = event.clientY;
          startX = Number(gsap.getProperty(layer, "x")) || 0;
          startY = Number(gsap.getProperty(layer, "y")) || 0;
          targetX = startX;
          targetY = startY;
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          lastPointerTime = performance.now();
          velocityX = 0;
          velocityY = 0;

          shell.style.zIndex = String(stackIndex++);
          layer.classList.add("is-dragging");

          if (!reducedMotion.matches) {
            gsap.to(layer, {
              scale: 1.018,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          event.preventDefault();
        };

        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerId !== activePointerId) return;

          const bounds = getDragBounds(shell, gallery);
          targetX = clamp(startX + event.clientX - startPointerX, bounds.minX, bounds.maxX);
          targetY = clamp(startY + event.clientY - startPointerY, bounds.minY, bounds.maxY);

          const now = performance.now();
          const elapsed = Math.max(8, now - lastPointerTime);
          velocityX = ((event.clientX - lastPointerX) / elapsed) * 1000;
          velocityY = ((event.clientY - lastPointerY) / elapsed) * 1000;

          if (reducedMotion.matches) {
            gsap.set(layer, { x: targetX, y: targetY, rotation: 0, scale: 1 });
          } else {
            xTo(targetX);
            yTo(targetY);
            rotationTo(clamp(velocityX * 0.0016, -2, 2));
          }

          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          lastPointerTime = now;
          event.preventDefault();
        };

        const finishDrag = (event: PointerEvent) => {
          if (event.pointerId !== activePointerId || activePointerId === null) return;

          const pointerId = activePointerId;
          activePointerId = null;
          layer.classList.remove("is-dragging");

          if (layer.hasPointerCapture(pointerId)) {
            layer.releasePointerCapture(pointerId);
          }

          if (reducedMotion.matches) {
            gsap.set(layer, { x: targetX, y: targetY, rotation: 0, scale: 1 });
            return;
          }

          const bounds = getDragBounds(shell, gallery);
          targetX = clamp(targetX + clamp(velocityX * 0.012, -18, 18), bounds.minX, bounds.maxX);
          targetY = clamp(targetY + clamp(velocityY * 0.012, -18, 18), bounds.minY, bounds.maxY);

          gsap.to(layer, {
            x: targetX,
            y: targetY,
            rotation: 0,
            scale: 1,
            duration: 0.62,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        layer.addEventListener("pointerdown", onPointerDown);
        layer.addEventListener("pointermove", onPointerMove);
        layer.addEventListener("pointerup", finishDrag);
        layer.addEventListener("pointercancel", finishDrag);
        layer.addEventListener("lostpointercapture", finishDrag);

        cleanups.push(() => {
          layer.removeEventListener("pointerdown", onPointerDown);
          layer.removeEventListener("pointermove", onPointerMove);
          layer.removeEventListener("pointerup", finishDrag);
          layer.removeEventListener("pointercancel", finishDrag);
          layer.removeEventListener("lostpointercapture", finishDrag);
          layer.classList.remove("is-dragging");
          shell.style.zIndex = "";
          gsap.killTweensOf(layer);
          gsap.set(layer, { clearProps: "transform" });
        });
      });

      const keepFragmentsInBounds = () => {
        shells.forEach((shell) => {
          const layer = shell.querySelector<HTMLElement>("[data-mm-fragment-drag]");
          if (!layer) return;

          const bounds = getDragBounds(shell, gallery);
          const currentX = Number(gsap.getProperty(layer, "x")) || 0;
          const currentY = Number(gsap.getProperty(layer, "y")) || 0;
          const nextX = clamp(currentX, bounds.minX, bounds.maxX);
          const nextY = clamp(currentY, bounds.minY, bounds.maxY);

          if (nextX !== currentX || nextY !== currentY) {
            gsap.set(layer, { x: nextX, y: nextY });
          }
        });
      };

      window.addEventListener("resize", keepFragmentsInBounds, { passive: true });
      cleanups.push(() => window.removeEventListener("resize", keepFragmentsInBounds));

      disposeDrag = () => cleanups.forEach((cleanup) => cleanup());
    };

    const handleModeChange = () => setupDrag();
    dragMedia.addEventListener("change", handleModeChange);
    reducedMotion.addEventListener("change", handleModeChange);
    setupDrag();

    return () => {
      dragMedia.removeEventListener("change", handleModeChange);
      reducedMotion.removeEventListener("change", handleModeChange);
      disposeDrag?.();
    };
  }, [rootRef]);
}
