import assert from "node:assert/strict";
import test from "node:test";

async function loadPolicy() {
  try {
    return await import("./remember-render-policy.ts");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_MODULE_NOT_FOUND"
    ) {
      return {
        shouldMountRestorationEffect: undefined,
        shouldUseMenuLiquidEther: undefined,
      };
    }
    throw error;
  }
}

test("restoration overlays do not exist while a memory is idle", async () => {
  const { shouldMountRestorationEffect } = await loadPolicy();
  assert.equal(typeof shouldMountRestorationEffect, "function");

  assert.equal(shouldMountRestorationEffect("idle"), false);
  assert.equal(shouldMountRestorationEffect("last-piece"), true);
  assert.equal(shouldMountRestorationEffect("kintsugi"), true);
  assert.equal(shouldMountRestorationEffect("pulse"), true);
  assert.equal(shouldMountRestorationEffect("restoring"), true);
  assert.equal(shouldMountRestorationEffect("revealing"), true);
  assert.equal(shouldMountRestorationEffect("restored"), true);
});

test("Liquid Ether is restricted to motion-capable fine-pointer WebGL sessions", async () => {
  const { shouldUseMenuLiquidEther } = await loadPolicy();
  assert.equal(typeof shouldUseMenuLiquidEther, "function");

  assert.equal(
    shouldUseMenuLiquidEther({
      reducedMotion: false,
      coarsePointer: false,
      webglAvailable: true,
    }),
    true,
  );
  assert.equal(
    shouldUseMenuLiquidEther({
      reducedMotion: true,
      coarsePointer: false,
      webglAvailable: true,
    }),
    false,
  );
  assert.equal(
    shouldUseMenuLiquidEther({
      reducedMotion: false,
      coarsePointer: true,
      webglAvailable: true,
    }),
    false,
  );
  assert.equal(
    shouldUseMenuLiquidEther({
      reducedMotion: false,
      coarsePointer: false,
      webglAvailable: false,
    }),
    false,
  );
});
