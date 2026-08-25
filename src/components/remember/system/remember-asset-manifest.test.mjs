import assert from "node:assert/strict";
import test from "node:test";

async function loadManifest() {
  try {
    return await import("./remember-asset-manifest.ts");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ERR_MODULE_NOT_FOUND") {
      return {};
    }
    throw error;
  }
}

test("initial preload is truthful and excludes late prologue media", async () => {
  const { getInitialAssetManifest } = await loadManifest();
  assert.equal(typeof getInitialAssetManifest, "function");

  const manifest = getInitialAssetManifest();
  const all = [...manifest.critical, ...manifest.next];

  assert.ok(manifest.critical.some((src) => src.includes("remember-menu-background")));
  assert.ok(manifest.critical.some((src) => src.includes("templo-hanamori_2")));
  assert.ok(manifest.critical.some((src) => src.includes("mr01-kintsugi-crack-overlay")));
  assert.ok(!all.some((src) => src.includes("yumegakure")));
  assert.ok(!all.some((src) => src.includes("gekkai")));
  assert.ok(!all.some((src) => src.includes("remember-epilogue-eclipse")));
  assert.ok(!all.some((src) => src.includes("remember-credits-loop")));
});

test("Hanamori preloads Mizukyo next without jumping ahead", async () => {
  const { getStageAssetManifest } = await loadManifest();
  assert.equal(typeof getStageAssetManifest, "function");

  const manifest = getStageAssetManifest("hanamori");
  assert.ok(manifest.next.some((src) => src.includes("remember-mizukyo-broken")));
  assert.ok(manifest.next.some((src) => src.includes("remember-mizukyo-restored")));
  assert.ok(!manifest.next.some((src) => src.includes("kurogane")));
  assert.ok(!manifest.next.some((src) => src.includes("yumegakure")));
});

test("epilogue video stays lazy until the Akari/finale boundary", async () => {
  const { getStageAssetManifest } = await loadManifest();
  assert.equal(typeof getStageAssetManifest, "function");

  const beforeFinale = getStageAssetManifest("gekkai");
  const akari = getStageAssetManifest("akari-reveal");

  assert.ok(![...beforeFinale.critical, ...beforeFinale.next].some((src) => src.includes("epilogue")));
  assert.ok(akari.next.some((src) => src.includes("remember-epilogue-eclipse")));
});

test("preload progress is direct loaded-over-total truth", async () => {
  const { createPreloadProgress } = await loadManifest();
  assert.equal(typeof createPreloadProgress, "function");
  assert.deepEqual(createPreloadProgress(0, 9), { loaded: 0, total: 9, ready: false });
  assert.deepEqual(createPreloadProgress(6, 9), { loaded: 6, total: 9, ready: false });
  assert.deepEqual(createPreloadProgress(9, 9), { loaded: 9, total: 9, ready: true });
});
