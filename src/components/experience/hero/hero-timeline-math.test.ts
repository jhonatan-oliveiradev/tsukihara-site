import assert from "node:assert/strict";
import test from "node:test";
import { clamp01, phaseWeights, rangeProgress, smoothRange } from "./hero-timeline-math";

test("clamp01 constrains values to the timeline domain", () => {
  assert.equal(clamp01(-0.2), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(1.4), 1);
});

test("rangeProgress maps an interval to normalized progress", () => {
  assert.equal(rangeProgress(0.1, 0.2, 0.6), 0);
  assert.equal(rangeProgress(0.4, 0.2, 0.6), 0.5);
  assert.equal(rangeProgress(0.8, 0.2, 0.6), 1);
});

test("smoothRange eases without leaving normalized bounds", () => {
  assert.equal(smoothRange(0.1, 0.2, 0.6), 0);
  assert.ok(smoothRange(0.4, 0.2, 0.6) > 0.45);
  assert.ok(smoothRange(0.4, 0.2, 0.6) < 0.55);
  assert.equal(smoothRange(0.8, 0.2, 0.6), 1);
});

test("phaseWeights follows the six approved narrative intervals", () => {
  assert.deepEqual(phaseWeights(0.06), {
    serenity: 0.5,
    omen: 0,
    eclipse: 0,
    awakening: 0,
    crimson: 0,
    resolve: 0,
  });

  assert.equal(phaseWeights(0.2).omen, 0.5);
  assert.equal(phaseWeights(0.38).eclipse, 0.5);
  assert.equal(phaseWeights(0.58).awakening, 0.5);
  assert.ok(Math.abs(phaseWeights(0.77).crimson - 0.5) < 1e-9);
  assert.ok(Math.abs(phaseWeights(0.93).resolve - 0.5) < 1e-9);
  assert.equal(phaseWeights(1).resolve, 1);
});
