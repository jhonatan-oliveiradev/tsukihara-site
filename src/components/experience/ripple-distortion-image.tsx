"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const LensDistortion = dynamic(
  () => import("@paper-design/shaders-react").then((module) => module.LensDistortion),
  { ssr: false },
);

type Ripple = {
  id: number;
  x: number;
  y: number;
};

type RippleDistortionImageProps = {
  src: string;
  alt: string;
  active?: boolean;
  sizes?: string;
  priority?: boolean;
  tint?: string;
  className?: string;
};

export function RippleDistortionImage({
  src,
  alt,
  active = false,
  sizes = "100vw",
  priority = false,
  tint = "#a40c26",
  className = "",
}: RippleDistortionImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lastPulseRef = useRef(0);
  const rippleIdRef = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const node = rootRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--ripple-x", `${x}%`);
    node.style.setProperty("--ripple-y", `${y}%`);

    if (!active || reducedMotion) return;
    const now = performance.now();
    if (now - lastPulseRef.current < 105) return;
    lastPulseRef.current = now;
    const id = ++rippleIdRef.current;
    setRipples((current) => [...current.slice(-3), { id, x, y }]);
  };

  const clearPointer = () => {
    const node = rootRef.current;
    if (!node) return;
    node.style.setProperty("--ripple-x", "50%");
    node.style.setProperty("--ripple-y", "50%");
  };

  return (
    <div
      ref={rootRef}
      className={`ix-ripple-distortion ${active ? "is-active" : ""} ${className}`.trim()}
      style={{ "--ripple-tint": tint } as CSSProperties}
      onPointerMove={updatePointer}
      onPointerLeave={clearPointer}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="ix-ripple-distortion__base"
      />

      {!reducedMotion && (
        <div className="ix-ripple-distortion__shader" aria-hidden="true">
          <LensDistortion
            width="100%"
            height="100%"
            image={src}
            fit="cover"
            spread={active ? 0.18 : 0.04}
            bias={0.44}
            perspective={active ? 0.075 : 0.018}
            count={active ? 20 : 7}
            dispersion={active ? 0.38 : 0.12}
            dispersionColor={0.22}
            focusCenter={0.72}
            focusEdges={0.9}
            swirl={active ? 0.11 : 0.012}
            noise={0.025}
            noiseFrequency={0.16}
            grainMixer={0.04}
            grainOverlay={0.025}
            maxPixelCount={1150000}
            minPixelRatio={0.85}
          />
        </div>
      )}

      <div className="ix-ripple-distortion__tint" aria-hidden="true" />
      {!reducedMotion && (
        <div className="ix-ripple-distortion__waves" aria-hidden="true">
          {ripples.map((ripple) => (
            <i
              key={ripple.id}
              style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
              onAnimationEnd={() =>
                setRipples((current) => current.filter((item) => item.id !== ripple.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
