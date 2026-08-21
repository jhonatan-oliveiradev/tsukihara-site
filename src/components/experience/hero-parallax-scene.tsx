"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  heroParallaxLayers,
  type HeroParallaxLayerId,
} from "@/components/experience/hero-parallax-config";

type LayerNodes = Partial<Record<HeroParallaxLayerId, HTMLDivElement>>;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const damp = (current: number, target: number, amount: number) =>
  current + (target - current) * amount;
const smoothstep = (value: number, start: number, end: number) => {
  const t = clamp((value - start) / Math.max(end - start, 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
};

export function HeroParallaxScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<LayerNodes>({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 680px)");
    const tabletQuery = window.matchMedia("(max-width: 980px)");

    if (reducedQuery.matches) return;

    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let opacityCurrent = 1;
    let frame = 0;
    let isMobile = mobileQuery.matches;
    let isTablet = tabletQuery.matches;

    const updateMediaState = () => {
      isMobile = mobileQuery.matches;
      isTablet = tabletQuery.matches;
      if (isMobile) {
        pointerTarget.x = 0;
        pointerTarget.y = 0;
      }
    };

    const updateScroll = () => {
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(rect.height + viewport * 0.52, 1);
      scrollTarget = clamp((-rect.top + viewport * 0.05) / travel, 0, 1);
    };

    const updatePointer = (event: PointerEvent) => {
      if (isMobile) return;
      pointerTarget.x = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerTarget.y = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    };

    const resetPointer = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    const render = (time: number) => {
      const seconds = time * 0.001;
      const motionScale = isMobile ? 0 : isTablet ? 0.58 : 1;

      pointerCurrent.x = damp(pointerCurrent.x, pointerTarget.x, 0.055);
      pointerCurrent.y = damp(pointerCurrent.y, pointerTarget.y, 0.055);
      scrollCurrent = damp(scrollCurrent, scrollTarget, 0.052);

      const targetOpacity = 1 - smoothstep(scrollCurrent, 0.7, 1);
      opacityCurrent = damp(opacityCurrent, targetOpacity, 0.065);
      root.style.opacity = opacityCurrent.toFixed(3);

      for (const layer of heroParallaxLayers) {
        const node = nodesRef.current[layer.id];
        if (!node) continue;

        const pointerX = pointerCurrent.x * layer.maxX * motionScale;
        const pointerY = pointerCurrent.y * layer.maxY * motionScale;
        const easedScroll = smoothstep(scrollCurrent, 0, 1);
        const scrollY = easedScroll * (10 + layer.depth * 88);
        const scrollX = easedScroll * layer.depth * -34;

        let ambientX = 0;
        let ambientY = 0;

        if (layer.id === "mist") {
          ambientX = Math.sin(seconds * 0.12) * (layer.ambientX ?? 0);
        } else if (layer.id === "sakura") {
          ambientX = Math.sin(seconds * 0.16) * (layer.ambientX ?? 0);
          ambientY = Math.cos(seconds * 0.13) * (layer.ambientY ?? 0);
        } else if (layer.id === "petals") {
          ambientX = -((seconds * 4.5) % ((layer.ambientX ?? 0) * 2)) + (layer.ambientX ?? 0);
          ambientY = Math.sin(seconds * 0.7) * (layer.ambientY ?? 0);
        }

        node.style.transform = `translate3d(${(pointerX + ambientX + scrollX).toFixed(2)}px, ${(pointerY - scrollY + ambientY).toFixed(2)}px, 0)`;
      }

      frame = requestAnimationFrame(render);
    };

    updateMediaState();
    updateScroll();

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", resetPointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    mobileQuery.addEventListener("change", updateMediaState);
    tabletQuery.addEventListener("change", updateMediaState);

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      mobileQuery.removeEventListener("change", updateMediaState);
      tabletQuery.removeEventListener("change", updateMediaState);
      root.style.opacity = "";

      for (const node of Object.values(nodesRef.current)) {
        if (node) node.style.transform = "";
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="ix-hero-parallax" aria-hidden="true">
      {heroParallaxLayers.map((layer) => (
        <div
          key={layer.id}
          className={`ix-parallax-layer ix-parallax-${layer.id}`}
          data-depth={layer.depth}
        >
          <div
            className="ix-parallax-motion"
            ref={(node) => {
              if (node) nodesRef.current[layer.id] = node;
              else delete nodesRef.current[layer.id];
            }}
          >
            <Image
              src={layer.src}
              alt=""
              fill
              priority={layer.priority}
              sizes={
                layer.id === "characters"
                  ? "(max-width: 680px) 92vw, (max-width: 980px) 70vw, 56vw"
                  : layer.id === "moon"
                    ? "(max-width: 680px) 48vw, 36vw"
                    : "100vw"
              }
              className="ix-parallax-image"
            />
          </div>
        </div>
      ))}
    </div>
  );
}