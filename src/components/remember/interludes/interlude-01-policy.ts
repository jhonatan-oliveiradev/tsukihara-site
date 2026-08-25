export const INTERLUDE_01_TRACE_IDS = [
  "lunar-residue",
  "broken-path",
  "memory-pulse",
  "distant-echo",
] as const;

export type Interlude01TraceId = (typeof INTERLUDE_01_TRACE_IDS)[number];

export const recordInterlude01Trace = (
  discovered: readonly Interlude01TraceId[],
  traceId: Interlude01TraceId,
): Interlude01TraceId[] =>
  discovered.includes(traceId) ? [...discovered] : [...discovered, traceId];

export const isInterlude01Complete = (discovered: readonly Interlude01TraceId[]) =>
  INTERLUDE_01_TRACE_IDS.every((traceId) => discovered.includes(traceId));
