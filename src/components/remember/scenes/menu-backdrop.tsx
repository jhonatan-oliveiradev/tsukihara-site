"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { rememberAssets } from "@/components/remember/content/remember-assets";

const LensDistortion = dynamic(
  () => import("@paper-design/shaders-react").then((module) => module.LensDistortion),
  { ssr: false },
);

const coarsePointerQuery = "(pointer: coarse)";

const subscribeCoarsePointer = (onStoreChange: () => void) => {
  const media = window.matchMedia(coarsePointerQuery);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
};

const getCoarsePointerSnapshot = () => window.matchMedia(coarsePointerQuery).matches;
const getCoarsePointerServerSnapshot = () => true;

export function RememberMenuBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const coarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointerSnapshot,
    getCoarsePointerServerSnapshot,
  );
  const shaderEnabled = !reducedMotion && !coarsePointer;

  return (
    <div className="remember-menu-backdrop" aria-hidden="true">
      <Image
        src={rememberAssets.menuBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="remember-menu-backdrop__image"
      />
      {shaderEnabled && (
        <div className="remember-menu-backdrop__shader">
          <LensDistortion
            width="100%"
            height="100%"
            image={rememberAssets.menuBackground}
            fit="cover"
            spread={0.035}
            bias={0.46}
            perspective={0.014}
            count={6}
            dispersion={0.16}
            dispersionColor={0.08}
            focusCenter={0.82}
            focusEdges={0.96}
            swirl={0.008}
            noise={0.025}
            noiseFrequency={0.12}
            grainMixer={0.035}
            grainOverlay={0.02}
            maxPixelCount={1200000}
            minPixelRatio={1}
          />
        </div>
      )}
      <div className="remember-menu-backdrop__veil" />
    </div>
  );
}
