"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import { shouldUseMenuLiquidEther } from "@/components/remember/system/remember-render-policy";
import { useRememberWebglAvailability } from "@/components/remember/system/use-remember-webgl";

const LiquidEther = dynamic(() => import("@/vendor/react-bits/liquid-ether"), { ssr: false });

const rememberEtherColors = ["#5c2030", "#b39562", "#d8aeb9"];
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
  const webglAvailable = useRememberWebglAvailability();
  const etherEnabled = shouldUseMenuLiquidEther({
    reducedMotion,
    coarsePointer,
    webglAvailable,
  });

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

      {etherEnabled ? (
        <div className="remember-menu-backdrop__ether" data-remember-liquid-ether>
          <LiquidEther
            colors={rememberEtherColors}
            mouseForce={14}
            cursorSize={88}
            resolution={0.34}
            iterationsPoisson={20}
            iterationsViscous={14}
            isViscous={false}
            BFECC
            autoDemo
            autoSpeed={0.28}
            autoIntensity={1.45}
            takeoverDuration={0.28}
            autoResumeDelay={900}
            autoRampDuration={0.8}
          />
        </div>
      ) : null}

      <div className="remember-menu-backdrop__veil" />
    </div>
  );
}
