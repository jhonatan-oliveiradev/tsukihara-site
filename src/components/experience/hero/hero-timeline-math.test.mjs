import assert from "node:assert/strict";
import test from "node:test";
import {
  clamp01,
  HERO_ECLIPSE_BEATS,
  heroCopyPhase,
  phaseWeights,
  rangeProgress,
  smoothRange,
} from "./hero-timeline-math.ts";

const approximately = (actual, expected, epsilon = 1e-9) => {
  assert.ok(Math.abs(actual - expected) < epsilon, `${actual} ≈ ${expected}`);
};

test("clamp01 constrains values to the timeline domain", () => {
  assert.equal(clamp01(-0.2), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(1.4), 1);
});

test("rangeProgress maps an interval to normalized progress", () => {
  assert.equal(rangeProgress(0.1, 0.2, 0.6), 0);
  approximately(rangeProgress(0.4, 0.2, 0.6), 0.5);
  assert.equal(rangeProgress(0.8, 0.2, 0.6), 1);
});

test("smoothRange eases without leaving normalized bounds", () => {
  assert.equal(smoothRange(0.1, 0.2, 0.6), 0);
  approximately(smoothRange(0.4, 0.2, 0.6), 0.5);
  assert.equal(smoothRange(0.8, 0.2, 0.6), 1);
});

test("phaseWeights follows the six approved narrative intervals", () => {
  approximately(phaseWeights(0.06).serenity, 0.5);
  assert.equal(phaseWeights(0.06).omen, 0);
  assert.equal(phaseWeights(0.06).eclipse, 0);
  assert.equal(phaseWeights(0.06).awakening, 0);
  assert.equal(phaseWeights(0.06).crimson, 0);
  assert.equal(phaseWeights(0.06).resolve, 0);

  approximately(phaseWeights(0.2).omen, 0.5);
  approximately(phaseWeights(0.38).eclipse, 0.5);
  approximately(phaseWeights(0.58).awakening, 0.5);
  approximately(phaseWeights(0.77).crimson, 0.5);
  approximately(phaseWeights(0.93).resolve, 0.5);
  assert.equal(phaseWeights(1).resolve, 1);
});

test("hero copy follows visible eclipse contact, transit and crimson beats", () => {
  const { contact, crimson } = HERO_ECLIPSE_BEATS;

  assert.equal(heroCopyPhase(contact - 0.001), "intro");
  assert.equal(heroCopyPhase(contact), "transit");
  assert.equal(heroCopyPhase((contact + crimson) / 2), "transit");
  assert.equal(heroCopyPhase(crimson - 0.001), "transit");
  assert.equal(heroCopyPhase(crimson), "crimson");
});
