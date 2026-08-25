import type { MemoryDefinition } from "../content/memory-definitions.ts";
import type { MemoryFragmentDefinition } from "./restore-geometry.ts";

type FragmentWithOptionalSource = MemoryFragmentDefinition & {
  sourceAsset?: string;
};

export const getRequiredFragmentIds = (memory: MemoryDefinition): string[] => {
  if (memory.mechanic === "false-memory") {
    return memory.fragments
      .filter((fragment) => fragment.truth === "true")
      .map((fragment) => fragment.id);
  }

  return memory.fragments.map((fragment) => fragment.id);
};

export const getStabilizedFalseFragmentIds = (
  memory: MemoryDefinition,
  restoredFragmentIds: string[],
): string[] => {
  if (memory.mechanic !== "false-memory") return [];

  const restored = new Set(restoredFragmentIds);
  return memory.fragments
    .filter((fragment) => fragment.truth === "false" && restored.has(fragment.id))
    .map((fragment) => fragment.id);
};

export const getRestoredRequiredFragmentCount = (
  memory: MemoryDefinition,
  restoredFragmentIds: string[],
): number => {
  const restored = new Set(restoredFragmentIds);
  return getRequiredFragmentIds(memory).filter((fragmentId) => restored.has(fragmentId)).length;
};

export const isMemoryReadyForRestoration = (
  memory: MemoryDefinition,
  restoredFragmentIds: string[],
): boolean => {
  const restored = new Set(restoredFragmentIds);
  const allRequiredFragmentsAreStable = getRequiredFragmentIds(memory).every((fragmentId) =>
    restored.has(fragmentId),
  );

  return (
    allRequiredFragmentsAreStable &&
    getStabilizedFalseFragmentIds(memory, restoredFragmentIds).length === 0
  );
};

export const getFragmentSource = (
  memory: MemoryDefinition,
  fragment: FragmentWithOptionalSource,
): string => {
  if (memory.mechanic === "false-memory" && fragment.sourceAsset) {
    return fragment.sourceAsset;
  }

  return memory.brokenAsset;
};

export const isFragmentReversible = (memory: MemoryDefinition): boolean =>
  memory.mechanic === "false-memory";
