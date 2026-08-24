import assert from "node:assert/strict";
import test from "node:test";
import { distanceBetween, isWithinSnapRadius, magneticProgress } from "./restore-math.ts";

test("distanceBetween is deterministic", () => {
  assert.equal(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test("snap threshold is generous but bounded", () => {
  assert.equal(isWithinSnapRadius({ x: 0, y: 0 }, { x: 5, y: 0 }, 6), true);
  assert.equal(isWithinSnapRadius({ x: 0, y: 0 }, { x: 7, y: 0 }, 6), false);
});

test("magneticProgress maps distance into a normalized pull", () => {
  assert.equal(magneticProgress(0, 100), 1);
  assert.equal(magneticProgress(50, 100), 0.5);
  assert.equal(magneticProgress(100, 100), 0);
  assert.equal(magneticProgress(120, 100), 0);
  assert.equal(magneticProgress(20, 0), 0);
});
