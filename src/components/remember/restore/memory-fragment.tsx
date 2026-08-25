"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import { magneticProgress, isWithinSnapRadius, type Point } from "./restore-math";
import type { MemoryFragmentDefinition } from "./restore-geometry";

type ViewBox = { width: number; height: number };

type MemoryFragmentProps = {
  memoryId: string;
  viewBox: ViewBox;
  definition: MemoryFragmentDefinition;
  source: string;
  restored: boolean;
  reversible?: boolean;
  reducedMotion: boolean;
  keyboardLabel: string;
  onRestore: (fragmentId: string) => void;
  onUnrestore?: (fragmentId: string) => void;
};

type DragState = {
  pointerId: number;
  startClient: Point;
  startTranslation: Point;
};

export function MemoryFragment({
  memoryId,
  viewBox,
  definition,
  source,
  restored,
  reversible = false,
  reducedMotion,
  keyboardLabel,
  onRestore,
  onUnrestore,
}: MemoryFragmentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<SVGPathElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const translationRef = useRef<Point>({ x: 0, y: 0 });
  const settledRef = useRef(restored);
  const interactedRef = useRef(false);
  const [active, setActive] = useState(false);
  const clipId = `remember-clip-${memoryId}-${definition.id}`;

  const setTransform = useCallback((point: Point) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    translationRef.current = point;
    gsap.set(wrapper, { x: point.x, y: point.y });
  }, []);

  const getStageMetrics = useCallback(() => {
    const stage = wrapperRef.current?.parentElement;
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    const responsiveScale = window.innerWidth <= 900 ? 0.56 : window.innerHeight < 720 ? 0.74 : 1;
    return {
      width: rect.width,
      height: rect.height,
      min: Math.min(rect.width, rect.height),
      responsiveScale,
    };
  }, []);

  const getSnapRadius = useCallback(
    (minimumStageDimension: number) => {
      const proportional = definition.snapRadius * minimumStageDimension;
      return Math.max(window.innerWidth <= 900 ? 42 : 36, proportional);
    },
    [definition.snapRadius],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    settledRef.current = restored;
    if (restored) {
      translationRef.current = { x: 0, y: 0 };
      gsap.set(wrapper, { x: 0, y: 0, rotation: 0, scale: 1 });
      return;
    }

    const placeInitial = () => {
      if (interactedRef.current || settledRef.current) return;
      const metrics = getStageMetrics();
      if (!metrics) return;
      const point = {
        x: definition.initial.x * metrics.width * metrics.responsiveScale,
        y: definition.initial.y * metrics.height * metrics.responsiveScale,
      };
      translationRef.current = point;
      gsap.set(wrapper, { x: point.x, y: point.y, rotation: definition.rotation, scale: 1 });
    };

    placeInitial();
    const stage = wrapper.parentElement;
    if (!stage) return;
    const observer = new ResizeObserver(placeInitial);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [definition, getStageMetrics, restored]);

  useEffect(
    () => () => {
      const hit = hitRef.current;
      const drag = dragRef.current;
      if (hit && drag && hit.hasPointerCapture(drag.pointerId)) {
        hit.releasePointerCapture(drag.pointerId);
      }
      dragRef.current = null;
    },
    [],
  );

  const settle = useCallback(() => {
    if (settledRef.current) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    settledRef.current = true;
    translationRef.current = { x: 0, y: 0 };
    gsap.to(wrapper, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: reducedMotion ? 0.18 : 0.55,
      ease: reducedMotion ? "power1.out" : "power3.out",
      onComplete: () => onRestore(definition.id),
    });
  }, [definition.id, onRestore, reducedMotion]);

  const releaseSettlement = useCallback(() => {
    if (!settledRef.current || !reversible || !onUnrestore) return false;
    settledRef.current = false;
    onUnrestore(definition.id);
    return true;
  }, [definition.id, onUnrestore, reversible]);

  const releasePointer = (target: SVGPathElement, pointerId: number) => {
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
    dragRef.current = null;
    setActive(false);
  };

  const handlePointerDown = (event: PointerEvent<SVGPathElement>) => {
    if (settledRef.current && !releaseSettlement()) return;

    interactedRef.current = true;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startTranslation: { ...translationRef.current },
    };
    setActive(true);
    gsap.to(wrapperRef.current, { scale: 1.018, duration: 0.2, ease: "power2.out" });
  };

  const handlePointerMove = (event: PointerEvent<SVGPathElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || settledRef.current) return;

    const metrics = getStageMetrics();
    if (!metrics) return;

    const raw = {
      x: drag.startTranslation.x + event.clientX - drag.startClient.x,
      y: drag.startTranslation.y + event.clientY - drag.startClient.y,
    };
    const distance = Math.hypot(raw.x, raw.y);
    const snapRadius = getSnapRadius(metrics.min);
    const magneticRadius = snapRadius * 1.75;
    const pull = magneticProgress(distance, magneticRadius) * 0.36;
    setTransform({ x: raw.x * (1 - pull), y: raw.y * (1 - pull) });
  };

  const handlePointerEnd = (event: PointerEvent<SVGPathElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const metrics = getStageMetrics();
    const point = translationRef.current;
    const shouldSnap = Boolean(
      metrics && isWithinSnapRadius(point, { x: 0, y: 0 }, getSnapRadius(metrics.min)),
    );

    releasePointer(event.currentTarget, event.pointerId);

    if (shouldSnap) {
      settle();
      return;
    }

    gsap.to(wrapperRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleKeyDown = (event: KeyboardEvent<SVGPathElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    interactedRef.current = true;

    if (settledRef.current) {
      if (!releaseSettlement()) return;
      const metrics = getStageMetrics();
      if (!metrics) return;
      const point = {
        x: definition.initial.x * metrics.width * metrics.responsiveScale,
        y: definition.initial.y * metrics.height * metrics.responsiveScale,
      };
      translationRef.current = point;
      gsap.to(wrapperRef.current, {
        x: point.x,
        y: point.y,
        rotation: definition.rotation,
        scale: 1,
        duration: reducedMotion ? 0.12 : 0.32,
        ease: "power2.out",
      });
      return;
    }

    settle();
  };

  const locked = restored && !reversible;

  return (
    <div
      ref={wrapperRef}
      className={[
        "remember-fragment",
        active && "is-active",
        restored && "is-restored",
        restored && reversible && "is-reversible",
      ]
        .filter(Boolean)
        .join(" ")}
      data-fragment-id={definition.id}
    >
      <svg
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="false"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={definition.path} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`} aria-hidden="true">
          <image
            href={source}
            width={viewBox.width}
            height={viewBox.height}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
        <path
          ref={hitRef}
          d={definition.path}
          className="remember-fragment__hit"
          fill="transparent"
          pointerEvents={locked ? "none" : "all"}
          role="button"
          tabIndex={locked ? -1 : 0}
          aria-label={`${keyboardLabel}: ${definition.id}`}
          aria-disabled={locked}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown}
        />
      </svg>
    </div>
  );
}
