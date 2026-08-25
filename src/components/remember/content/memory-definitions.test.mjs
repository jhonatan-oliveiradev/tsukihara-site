import assert from "node:assert/strict";
import test from "node:test";
import { memoryDefinitions } from "./memory-definitions.ts";

test("memory definitions follow the five-memory prologue order", () => {
  assert.deepEqual(
    memoryDefinitions.map((memory) => memory.id),
    ["hanamori", "mizukyo", "kurogane", "yumegakure", "gekkai"],
  );
  assert.deepEqual(
    memoryDefinitions.map((memory) => memory.index),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(
    memoryDefinitions.map((memory) => memory.mechanic),
    ["standard", "standard", "standard", "false-memory", "overlapping"],
  );
  assert.deepEqual(
    memoryDefinitions.map((memory) => memory.fragments.length),
    [5, 7, 9, 9, 8],
  );
});

test("every memory keeps the reusable puzzle contract", () => {
  for (const memory of memoryDefinitions) {
    assert.deepEqual(memory.viewBox, { width: 1000, height: 625 });
    assert.ok(memory.brokenAsset.startsWith("/"));
    assert.ok(memory.restoredAsset.startsWith("/"));
    assert.ok(memory.seams.length > 0);
    assert.ok(memory.fragments.every((fragment) => fragment.snapRadius >= 0.06));
    assert.ok(memory.fragments.every((fragment) => fragment.snapRadius <= 0.11));
    assert.ok(memory.completionCopy.pt.length > 0);
    assert.ok(memory.completionCopy.en.length > 0);
    assert.ok(Number.isFinite(memory.parSeconds) && memory.parSeconds > 0);
  }
});

test("Yumegakure has seven true and exactly two false fragments with real false assets", () => {
  const yumegakure = memoryDefinitions.find((memory) => memory.id === "yumegakure");
  assert.ok(yumegakure);
  assert.equal(yumegakure.mechanic, "false-memory");

  const trueFragments = yumegakure.fragments.filter((fragment) => fragment.truth === "true");
  const falseFragments = yumegakure.fragments.filter((fragment) => fragment.truth === "false");
  assert.equal(trueFragments.length, 7);
  assert.equal(falseFragments.length, 2);
  assert.ok(falseFragments.every((fragment) => fragment.sourceAsset?.startsWith("/remember-experience/")));
  assert.ok(yumegakure.distortionAsset.startsWith("/remember-experience/"));
});

test("Gekkai has eight fragments with stable realities and real focus assets", () => {
  const gekkai = memoryDefinitions.find((memory) => memory.id === "gekkai");
  assert.ok(gekkai);
  assert.equal(gekkai.mechanic, "overlapping");
  assert.equal(gekkai.fragments.length, 8);
  assert.ok(gekkai.fragments.every((fragment) => fragment.stableReality === "a" || fragment.stableReality === "b"));
  assert.ok(gekkai.stateAAsset.startsWith("/remember-experience/"));
  assert.ok(gekkai.stateBAsset.startsWith("/remember-experience/"));
  assert.ok(gekkai.focusOverlayAsset.startsWith("/remember-experience/"));
});
