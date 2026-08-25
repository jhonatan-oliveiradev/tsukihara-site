import type { MemoryDefinition } from "../content/memory-definitions.ts";
import type { MemoryId } from "../state/remember-state.ts";

export type ScatterPoint = {
  x: number;
  y: number;
  rotation: number;
};

export type ScatterViewport = {
  width: number;
  height: number;
  mobile: boolean;
};

type RotationRange = { min: number; max: number };

const DESKTOP_ZONES = [
  [-0.37, -0.27],
  [0.37, -0.27],
  [-0.4, 0],
  [0.4, 0.02],
  [-0.35, 0.3],
  [0.35, 0.3],
  [-0.12, -0.33],
  [0.12, 0.33],
  [0.31, -0.04],
] as const;

const MOBILE_ZONES = [
  [-0.33, -0.31],
  [0.33, -0.31],
  [-0.38, -0.06],
  [0.38, -0.04],
  [-0.34, 0.24],
  [0.34, 0.24],
  [-0.08, -0.34],
  [0.09, 0.34],
  [0.3, 0.08],
] as const;

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createPrng = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

export const getScatterRotationRange = (memoryId: MemoryId): RotationRange => {
  if (memoryId === "hanamori") return { min: 8, max: 15 };
  if (memoryId === "mizukyo") return { min: 12, max: 20 };
  if (memoryId === "kurogane") return { min: 16, max: 28 };
  return { min: 10, max: 18 };
};

export const createScatterSeed = (memoryId: MemoryId, runSeed: number) =>
  (hashString(memoryId) ^ (runSeed >>> 0)) >>> 0;

export const createScatterLayout = (
  memory: MemoryDefinition,
  seed: number,
  viewport: ScatterViewport,
): Record<string, ScatterPoint> => {
  const zones = viewport.mobile ? MOBILE_ZONES : DESKTOP_ZONES;
  const random = createPrng(createScatterSeed(memory.id, seed));
  const rotationRange = getScatterRotationRange(memory.id);
  const layout: Record<string, ScatterPoint> = {};

  memory.fragments.forEach((fragment, index) => {
    const zone = zones[index % zones.length];
    const horizontalJitter = (random() - 0.5) * (viewport.mobile ? 0.025 : 0.035);
    const verticalJitter = (random() - 0.5) * (viewport.mobile ? 0.022 : 0.03);
    const rotationMagnitude =
      rotationRange.min + random() * (rotationRange.max - rotationRange.min);
    const rotationSign = random() >= 0.5 ? 1 : -1;

    layout[fragment.id] = {
      x: (zone[0] + horizontalJitter) * viewport.width,
      y: (zone[1] + verticalJitter) * viewport.height,
      rotation: rotationMagnitude * rotationSign,
    };
  });

  return layout;
};
