export type EclipseMoonReconstruction = Readonly<{
  evidence: "single-front-view";
  diskRadius: number;
  shadowRadius: number;
  rimInnerRadius: number;
  rimOuterRadius: number;
  haloRadius: number;
  segments: number;
  diskColor: string;
  shadowColor: string;
  rimColor: string;
  rimOpacity: number;
  haloOpacity: number;
}>;

/**
 * Evidence-limited blockout derived from the supplied blood-moon reference.
 * The source supports a frontal dark lunar disc with a luminous crimson rim,
 * but it does not support claims about hidden or rear geometry.
 * Radii stay anchored to the existing runtime moon proportions.
 */
export function createEclipseMoonReconstruction(): EclipseMoonReconstruction {
  return Object.freeze({
    evidence: "single-front-view",
    diskRadius: 1.9,
    shadowRadius: 1.93,
    rimInnerRadius: 1.88,
    rimOuterRadius: 2.06,
    haloRadius: 2.55,
    segments: 128,
    diskColor: "#c03337",
    shadowColor: "#05070a",
    rimColor: "#df343c",
    rimOpacity: 0.34,
    haloOpacity: 0.12,
  });
}
