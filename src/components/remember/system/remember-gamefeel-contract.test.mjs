import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => {
  try {
    return fs.readFileSync(new URL(path, import.meta.url), "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
};

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

test("restored memories hand off organically through preload plus the transition veil", () => {
  const experience = read("../remember-experience.tsx");
  const handleContinue =
    experience.match(/const handleContinue = useCallback\([\s\S]*?\n  \}, \[[\s\S]*?\]\);/)?.[0] ?? "";

  assert.match(handleContinue, /const nextMemory = memoryDefinitions\[state\.activeMemoryIndex \+ 1\]/);
  assert.match(handleContinue, /getStageAssetManifest\(nextMemory\.id\)/);
  assert.match(handleContinue, /await requestTransition/);
  assert.match(handleContinue, /dispatch\(\{ type: "CONTINUE" \}\)/);
  assert.match(handleContinue, /preloadRememberAssets\(manifest\.critical\)/);
  assert.match(handleContinue, /preloadRememberAssetsInBackground\(manifest\.next\)/);
});

test("game preloader exposes loaded and total counts instead of synthetic percentage", () => {
  const preloader = read("../scenes/game-preloader.tsx");
  assert.match(preloader, /progress\.loaded/);
  assert.match(preloader, /progress\.total/);
  assert.doesNotMatch(preloader, /%/);
});

test("pause control switches between pause and resume copy while preserving header typography", () => {
  const shell = read("../remember-shell.tsx");
  const locales = read("../content/remember-locales.ts");
  const styles = read("../../../app/remember/remember-game.css");

  assert.match(shell, /paused \? copy\.controls\.resume : copy\.controls\.pause/);
  assert.match(locales, /resume: "Retomar memória"/);
  assert.match(locales, /resume: "Resume memory"/);
  assert.match(styles, /\.remember-pause-toggle[\s\S]*font: inherit/);
});

test("pause and archive overlays render outside the gameplay stage stacking context", () => {
  const shell = read("../remember-shell.tsx");
  const experience = read("../remember-experience.tsx");

  assert.match(shell, /overlay\?: ReactNode/);
  assert.match(shell, /<div className="remember-stage">\{children\}<\/div>[\s\S]*\{overlay\}/);
  assert.match(experience, /overlay=\{/);
});
