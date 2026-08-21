"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const LensDistortion = dynamic(
  () => import("@paper-design/shaders-react").then((module) => module.LensDistortion),
  { ssr: false },
);

const Heatmap = dynamic(
  () => import("@paper-design/shaders-react").then((module) => module.Heatmap),
  { ssr: false },
);

const LiquidMetal = dynamic(
  () => import("@paper-design/shaders-react").then((module) => module.LiquidMetal),
  { ssr: false },
);

export type ShaderImageVariant = "lens" | "heatmap" | "liquid";

type ShaderImageProps = {
  src: string;
  alt: string;
  variant?: ShaderImageVariant;
  className?: string;
  imageClassName?: string;
  active?: boolean;
  contain?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function ShaderImage({
  src,
  alt,
  variant = "lens",
  className = "",
  imageClassName = "",
  active = false,
  contain = false,
  priority = false,
  sizes = "100vw",
}: ShaderImageProps) {
  const fit = contain ? "contain" : "cover";

  return (
    <div className={`ix-shader-image ${active ? "is-active" : ""} ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`ix-shader-image-base ${imageClassName}`.trim()}
        style={{ objectFit: fit }}
      />
      <div className="ix-shader-image-effect" aria-hidden="true">
        {variant === "lens" && (
          <LensDistortion
            width="100%"
            height="100%"
            image={src}
            fit={fit}
            spread={active ? 0.19 : 0.055}
            bias={0.42}
            perspective={active ? 0.08 : 0.025}
            count={active ? 18 : 8}
            dispersion={0.45}
            dispersionColor={0.28}
            focusCenter={0.76}
            focusEdges={0.9}
            swirl={active ? 0.06 : 0.015}
            noise={0.04}
            noiseFrequency={0.18}
            grainMixer={0.08}
            grainOverlay={0.04}
            maxPixelCount={1400000}
            minPixelRatio={1}
          />
        )}
        {variant === "heatmap" && (
          <Heatmap
            width="100%"
            height="100%"
            image={src}
            colors={["#6f0914", "#c33a45", "#edb0b5", "#efe0c8"]}
            colorBack="#030407"
            contour={0.62}
            angle={310}
            noise={0.08}
            innerGlow={0.48}
            outerGlow={0.28}
            speed={active ? 0.24 : 0}
            scale={0.88}
            maxPixelCount={1100000}
            minPixelRatio={1}
          />
        )}
        {variant === "liquid" && (
          <LiquidMetal
            width="100%"
            height="100%"
            image={src}
            colorBack="#06070a"
            colorTint="#f3c9c7"
            repetition={2}
            softness={0.15}
            shiftRed={0.18}
            shiftBlue={0.1}
            distortion={active ? 0.12 : 0.035}
            contour={0.48}
            angle={68}
            speed={active ? 0.22 : 0}
            scale={0.9}
            fit={fit}
            maxPixelCount={1100000}
            minPixelRatio={1}
          />
        )}
      </div>
    </div>
  );
}
