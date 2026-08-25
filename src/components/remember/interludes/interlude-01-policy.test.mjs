import assert from "node:assert/strict";
import test from "node:test";
import {
  INTERLUDE_01_TRACE_IDS,
  isInterlude01Complete,
  recordInterlude01Trace,
} from "./interlude-01-policy.ts";

test("Interlude I exposes exactly four unique traces", () => {
  assert.equal(INTERLUDE_01_TRACE_IDS.length, 4);
  assert.equal(new Set(INTERLUDE_01_TRACE_IDS).size, 4);
});

test("duplicate trace discoveries never advance Interlude I progress", () => {
  let traces = [];
  traces = recordInterlude01Trace(traces, INTERLUDE_01_TRACE_IDS[0]);
  traces = recordInterlude01Trace(traces, INTERLUDE_01_TRACE_IDS[0]);

  assert.equal(traces.length, 1);
  assert.equal(isInterlude01Complete(traces), false);
});

test("Interlude I unlocks continuation only after all four traces are discovered", () => {
  let traces = [];
  for (const traceId of INTERLUDE_01_TRACE_IDS) {
    traces = recordInterlude01Trace(traces, traceId);
  }

  assert.equal(traces.length, 4);
  assert.equal(isInterlude01Complete(traces), true);
});
