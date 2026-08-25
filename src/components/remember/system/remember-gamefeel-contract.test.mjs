import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("Boot accepts game-style keyboard input in addition to pointer activation", () => {
  const boot = read("../scenes/boot-scene.tsx");
  assert.match(boot, /addEventListener\("keydown"/);
  assert.match(boot, /event\.key === "Enter"/);
  assert.match(boot, /event\.key === " "/);
  assert.match(boot, /event\.key\.length === 1/);
  assert.match(boot, /event\.ctrlKey/);
  assert.match(boot, /event\.metaKey/);
  assert.match(boot, /event\.altKey/);
});

test("Menu resolves Japanese memory glyphs into localized cinematic copy", () => {
  const menu = read("../scenes/menu-scene.tsx");
  assert.match(menu, /components\/shared\/jp-reveal-text/);
  assert.match(menu, /jp="記憶"/);
  assert.match(menu, /text=\{copy\.title\}/);
  assert.match(menu, /jp="記憶を取り戻せ"/);
  assert.match(menu, /text=\{copy\.thesis\}/);
});

test("REMEMBER composition routes scene changes through the transition director and truthful preloader", () => {
  const experience = read("../remember-experience.tsx");
  assert.match(experience, /SceneTransitionDirector/);
  assert.match(experience, /GamePreloader/);
  assert.match(experience, /requestTransition/);
});

test("game preloader exposes loaded and total counts instead of synthetic percentage", () => {
  const preloader = read("../scenes/game-preloader.tsx");
  assert.match(preloader, /progress\.loaded/);
  assert.match(preloader, /progress\.total/);
  assert.doesNotMatch(preloader, /%/);
});
