"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/immersive-copy";

const glyphs = "月影刃華神霧鉄夢朱守蝕道火水花夜魂祈";
const DEFERRED_REVEAL_EVENT = "tsukihara:jp-reveal";

type JpRevealTextProps = {
  jp: string;
  text: string;
  locale: Locale;
  className?: string;
  duration?: number;
  delay?: number;
  deferred?: boolean;
};

export function JpRevealText({
  jp,
  text,
  locale,
  className,
  duration = 980,
  delay = 80,
  deferred = false,
}: JpRevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(jp);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;
    let timeout = 0;
    let started = false;

    const stopFrame = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };

    const resolveImmediately = () => {
      stopFrame();
      setDisplay(text);
    };

    const animate = () => {
      if (started) return;
      started = true;
      setDisplay(jp);

      if (reduced.matches) {
        resolveImmediately();
        return;
      }

      timeout = window.setTimeout(() => {
        const start = performance.now();
        const target = Array.from(text);

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const settled = Math.floor(target.length * eased);
          const phase = Math.floor((now - start) / 42);

          const next = target
            .map((character, index) => {
              if (/\s/.test(character)) return character;
              if (index < settled) return character;
              return glyphs[(index * 7 + phase * 3 + locale.length) % glyphs.length];
            })
            .join("");

          setDisplay(next);

          if (progress < 1) {
            frameRef.current = requestAnimationFrame(tick);
          } else {
            setDisplay(text);
            frameRef.current = null;
          }
        };

        frameRef.current = requestAnimationFrame(tick);
      }, delay);
    };

    const onDeferredReveal = () => animate();

    if (deferred) {
      node.addEventListener(DEFERRED_REVEAL_EVENT, onDeferredReveal);
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate();
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
      );

      observer.observe(node);
    }

    const onReducedMotionChange = () => {
      if (reduced.matches) resolveImmediately();
    };
    reduced.addEventListener("change", onReducedMotionChange);

    return () => {
      observer?.disconnect();
      node.removeEventListener(DEFERRED_REVEAL_EVENT, onDeferredReveal);
      window.clearTimeout(timeout);
      stopFrame();
      reduced.removeEventListener("change", onReducedMotionChange);
    };
  }, [deferred, delay, duration, jp, locale, text]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      data-jp-reveal
      data-jp-reveal-deferred={deferred || undefined}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
