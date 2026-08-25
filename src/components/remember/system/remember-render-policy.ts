import type { RestorationPhase } from "@/components/remember/state/remember-state";

export const shouldMountRestorationEffect = (phase: RestorationPhase) => phase !== "idle";

export const shouldUseMenuLiquidEther = ({
  reducedMotion,
  coarsePointer,
  webglAvailable,
}: {
  reducedMotion: boolean;
  coarsePointer: boolean;
  webglAvailable: boolean;
}) => !reducedMotion && !coarsePointer && webglAvailable;
