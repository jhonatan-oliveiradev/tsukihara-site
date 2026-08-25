"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import type { PreloadProgress } from "@/components/remember/system/remember-asset-manifest";

type GamePreloaderProps = {
  progress: PreloadProgress;
  label: string;
  fragmentsLabel: string;
  retryLabel: string;
  error: boolean;
  reducedMotion: boolean;
  onRetry: () => void;
  onFinished: () => void;
};

export function GamePreloader({
  progress,
  label,
  fragmentsLabel,
  retryLabel,
  error,
  reducedMotion,
  onRetry,
  onFinished,
}: GamePreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef(onFinished);

  useEffect(() => {
    finishRef.current = onFinished;
  }, [onFinished]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !progress.ready || error) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: () => finishRef.current() });
      timeline
        .to(".remember-preloader__sigil", {
          scale: reducedMotion ? 1 : 1.06,
          opacity: 1,
          duration: reducedMotion ? 0.08 : 0.28,
          ease: "power2.out",
        })
        .to(
          root,
          {
            opacity: 0,
            duration: reducedMotion ? 0.12 : 0.58,
            ease: "power2.inOut",
          },
          reducedMotion ? "+=0.04" : "+=0.22",
        );
    }, root);

    return () => ctx.revert();
  }, [error, progress.ready, reducedMotion]);

  const ratio = progress.total > 0 ? progress.loaded / progress.total : 1;
  const style = { "--remember-load-ratio": ratio } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="remember-preloader"
      data-ready={progress.ready || undefined}
      style={style}
      role="status"
      aria-live="polite"
    >
      <div className="remember-preloader__ritual" aria-hidden="true">
        <span className="remember-preloader__ring remember-preloader__ring--outer" />
        <span className="remember-preloader__ring remember-preloader__ring--inner" />
        <span className="remember-preloader__crack remember-preloader__crack--a" />
        <span className="remember-preloader__crack remember-preloader__crack--b" />
        <span className="remember-preloader__crack remember-preloader__crack--c" />
        <strong className="remember-preloader__sigil">月</strong>
      </div>

      <div className="remember-preloader__copy">
        <span>{label}</span>
        <small>
          {fragmentsLabel} {progress.loaded} / {progress.total}
        </small>
      </div>

      {error && (
        <button type="button" className="remember-preloader__retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
