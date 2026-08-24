"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

const DRAG_MEDIA_QUERY = "(min-width: 901px) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FOLLOW_STRENGTH = 0.22;
const ROTATION_STRENGTH = 0.24;
const SCALE_STRENGTH = 0.2;

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

      const shells = Array.from(gallery.querySelectorAll<HTMLElement>("[data-mm-presence-detail]"));
      let stackIndex = shells.length + 1;
      const cleanups: Array<() => void> = [];
      const keepInBounds: Array<() => void> = [];

      shells.forEach((shell, index) => {
        const layer = shell.querySelector<HTMLElement>("[data-mm-fragment-drag]");
        if (!layer) return;

        shell.style.zIndex = String(index + 1);

        const setX = gsap.quickSetter(layer, "x", "px");
        const setY = gsap.quickSetter(layer, "y", "px");
        const setRotation = gsap.quickSetter(layer, "rotation", "deg");
        const setScale = gsap.quickSetter(layer, "scale");

        let settleTween: ReturnType<typeof gsap.to> | null = null;
        let frameId: number | null = null;
        let activePointerId: number | null = null;
        let startPointerX = 0;
        let startPointerY = 0;
        let startX = 0;
        let startY = 0;
        let targetX = 0;
        let targetY = 0;
        let targetRotation = 0;
        let targetScale = 1;
        let visualX = 0;
        let visualY = 0;
        let visualRotation = 0;
        let visualScale = 1;
        let lastPointerX = 0;
        let lastPointerY = 0;
        let lastPointerTime = 0;
        let velocityX = 0;
        let velocityY = 0;

        const stopFrame = () => {
          if (frameId === null) return;
          cancelAnimationFrame(frameId);
          frameId = null;
        };

        const renderDragFrame = () => {
          if (activePointerId === null) {
            frameId = null;
            return;
          }

          visualX += (targetX - visualX) * FOLLOW_STRENGTH;
          visualY += (targetY - visualY) * FOLLOW_STRENGTH;
          visualRotation += (targetRotation - visualRotation) * ROTATION_STRENGTH;
          visualScale += (targetScale - visualScale) * SCALE_STRENGTH;

          setX(visualX);
          setY(visualY);
          setRotation(visualRotation);
          setScale(visualScale);
          frameId = requestAnimationFrame(renderDragFrame);
        };

        const startFrame = () => {
          if (frameId !== null || reducedMotion.matches) return;
          frameId = requestAnimationFrame(renderDragFrame);
        };

        const onPointerDown = (event: PointerEvent) => {
          if (activePointerId !== null) return;
          if (event.pointerType === "mouse" && event.button !== 0) return;

          settleTween?.kill();
          settleTween = null;

          activePointerId = event.pointerId;
          layer.setPointerCapture(event.pointerId);

          startPointerX = event.clientX;
          startPointerY = event.clientY;
          visualX = Number(gsap.getProperty(layer, "x")) || 0;
          visualY = Number(gsap.getProperty(layer, "y")) || 0;
          visualRotation = Number(gsap.getProperty(layer, "rotation")) || 0;
          visualScale = Number(gsap.getProperty(layer, "scale")) || 1;
          startX = visualX;
          startY = visualY;
          targetX = visualX;
          targetY = visualY;
          targetRotation = visualRotation;
          targetScale = reducedMotion.matches ? 1 : 1.018;
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          lastPointerTime = performance.now();
          velocityX = 0;
          velocityY = 0;

          shell.style.zIndex = String(stackIndex++);
          layer.classList.add("is-dragging");

          if (reducedMotion.matches) {
            setRotation(0);
            setScale(1);
          } else {
            startFrame();
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
          targetRotation = reducedMotion.matches ? 0 : clamp(velocityX * 0.0016, -2, 2);

          if (reducedMotion.matches) {
            visualX = targetX;
            visualY = targetY;
            visualRotation = 0;
            visualScale = 1;
            setX(visualX);
            setY(visualY);
            setRotation(visualRotation);
            setScale(visualScale);
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
          stopFrame();
          layer.classList.remove("is-dragging");

          if (layer.hasPointerCapture(pointerId)) {
            layer.releasePointerCapture(pointerId);
          }

          if (reducedMotion.matches) {
            visualX = targetX;
            visualY = targetY;
            visualRotation = 0;
            visualScale = 1;
            setX(visualX);
            setY(visualY);
            setRotation(visualRotation);
            setScale(visualScale);
            return;
          }

          const bounds = getDragBounds(shell, gallery);
          targetX = clamp(targetX + clamp(velocityX * 0.012, -18, 18), bounds.minX, bounds.maxX);
          targetY = clamp(targetY + clamp(velocityY * 0.012, -18, 18), bounds.minY, bounds.maxY);

          settleTween = gsap.to(layer, {
            x: targetX,
            y: targetY,
            rotation: 0,
            scale: 1,
            duration: 0.62,
            ease: "power3.out",
            overwrite: true,
            onComplete: () => {
              settleTween = null;
            },
          });
        };

        const keepFragmentInBounds = () => {
          if (activePointerId !== null) return;

          settleTween?.kill();
          settleTween = null;
          const bounds = getDragBounds(shell, gallery);
          const currentX = Number(gsap.getProperty(layer, "x")) || 0;
          const currentY = Number(gsap.getProperty(layer, "y")) || 0;
          const nextX = clamp(currentX, bounds.minX, bounds.maxX);
          const nextY = clamp(currentY, bounds.minY, bounds.maxY);

          targetX = nextX;
          targetY = nextY;
          visualX = nextX;
          visualY = nextY;
          visualRotation = 0;
          visualScale = 1;
          gsap.set(layer, { x: nextX, y: nextY, rotation: 0, scale: 1 });
        };

        keepInBounds.push(keepFragmentInBounds);
        layer.addEventListener("pointerdown", onPointerDown);
        layer.addEventListener("pointermove", onPointerMove);
        layer.addEventListener("pointerup", finishDrag);
        layer.addEventListener("pointercancel", finishDrag);
        layer.addEventListener("lostpointercapture", finishDrag);

        cleanups.push(() => {
          stopFrame();
          settleTween?.kill();
          layer.removeEventListener("pointerdown", onPointerDown);
          layer.removeEventListener("pointermove", onPointerMove);
          layer.removeEventListener("pointerup", finishDrag);
          layer.removeEventListener("pointercancel", finishDrag);
          layer.removeEventListener("lostpointercapture", finishDrag);
          layer.classList.remove("is-dragging");
          shell.style.zIndex = "";
          gsap.set(layer, { clearProps: "transform" });
        });
      });

      const keepFragmentsInBounds = () => keepInBounds.forEach((keepFragment) => keepFragment());
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
