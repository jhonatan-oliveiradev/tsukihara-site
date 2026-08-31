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

test("restored memories hand off organically through the canonical stage graph and transition veil", () => {
  const experience = read("../remember-experience.tsx");
  const transitionToNextStage =
    experience.match(
      /const transitionToNextStage = useCallback\([\s\S]*?\n  \}, \[[\s\S]*?\]\);/,
    )?.[0] ?? "";

  assert.match(transitionToNextStage, /getNextStage\(state\.currentStage\)/);
  assert.match(transitionToNextStage, /getStageAssetManifest\(nextStage\)/);
  assert.match(transitionToNextStage, /await requestTransition/);
  assert.match(transitionToNextStage, /dispatch\(\{ type: "CONTINUE" \}\)/);
  assert.match(transitionToNextStage, /preloadRememberAssets\(manifest\.critical\)/);
  assert.match(transitionToNextStage, /preloadRememberAssetsInBackground\(manifest\.next\)/);
  assert.doesNotMatch(experience, /memoryDefinitions\[state\.activeMemoryIndex \+ 1\]/);
});

test("Yumegakure wires false assets, instability, and reversible stabilized fragments", () => {
  const puzzle = read("../restore/memory-puzzle.tsx");
  const fragment = read("../restore/memory-fragment.tsx");
  const experience = read("../remember-experience.tsx");

  assert.match(puzzle, /getFragmentSource\(memory, fragment\)/);
  assert.match(puzzle, /memory\.distortionAsset/);
  assert.match(puzzle, /onUnrestore=\{interactive \? onUnrestore : undefined\}/);
  assert.match(fragment, /releaseSettlement/);
  assert.match(fragment, /is-reversible/);
  assert.match(experience, /isMemoryReadyForRestoration\(activeMemory, restoredFragmentIds\)/);
  assert.match(experience, /type: "UNRESTORE_FRAGMENT"/);
});

test("Gekkai runs overlapping realities with one Lunar Focus action for SPACE and touch", () => {
  const puzzle = read("../restore/memory-puzzle.tsx");
  const fragment = read("../restore/memory-fragment.tsx");

  assert.match(puzzle, /lunar-focus-policy/);
  assert.match(puzzle, /requestAnimationFrame/);
  assert.match(puzzle, /memory\.stateAAsset/);
  assert.match(puzzle, /memory\.stateBAsset/);
  assert.match(puzzle, /memory\.focusOverlayAsset/);
  assert.match(puzzle, /event\.code !== "Space"/);
  assert.match(puzzle, /data-lunar-focus/);
  assert.match(puzzle, /onClick=\{activateFocus\}/);
  assert.match(puzzle, /isRealitySnapAllowed/);
  assert.match(fragment, /alternateSource/);
  assert.match(fragment, /sourceBlend/);
  assert.match(fragment, /canRestore/);
  assert.match(fragment, /onInvalidRestore/);
});

test("Memory Results persist pause-safe metrics and render before continuation", () => {
  const experience = read("../remember-experience.tsx");
  const restore = read("../scenes/restore-scene.tsx");
  const locales = read("../content/remember-locales.ts");

  assert.match(experience, /results\/memory-result/);
  assert.match(experience, /createMemoryResult/);
  assert.match(experience, /memoryElapsedMsRef/);
  assert.match(experience, /performance\.now\(\)/);
  assert.match(experience, /falseFragments/);
  assert.match(experience, /mistakes/);
  assert.match(experience, /memories:/);
  assert.match(experience, /memoryResult=/);
  assert.match(restore, /memoryResult/);
  assert.match(restore, /data-memory-result/);
  assert.match(restore, /copy\.integrity/);
  assert.match(restore, /copy\.resonance/);
  assert.match(locales, /integrity: "Integridade"/);
  assert.match(locales, /resonance: "Ressonância"/);
  assert.match(locales, /integrity: "Integrity"/);
  assert.match(locales, /resonance: "Resonance"/);
});

test("Interlude I unlock CTA gains the approved gold fill and luminous hover treatment", () => {
  const interlude = read("../interludes/interlude-01-scene.tsx");

  assert.match(interlude, /const continueUnlocked = complete && interactive/);
  assert.match(interlude, /className="remember-interlude__continue"/);
  assert.match(interlude, /data-unlocked=\{continueUnlocked\}/);
  assert.match(interlude, /background: continueUnlocked/);
  assert.match(interlude, /continueHovered/);
  assert.match(interlude, /boxShadow:/);
});

test("REMEMBER prevents accidental selection and image dragging without disabling controls", () => {
  const styles = read("../../../app/remember/remember.css");

  assert.match(styles, /\.remember-root \{[\s\S]*?-webkit-user-select: none/);
  assert.match(styles, /\.remember-root \{[\s\S]*?user-select: none/);
  assert.match(styles, /\.remember-root img[\s\S]*?-webkit-user-drag: none/);
  assert.match(styles, /\.remember-root img[\s\S]*?pointer-events: none/);
  assert.match(styles, /\.remember-control \{[\s\S]*?pointer-events: auto/);
  assert.match(styles, /\.remember-fragment__hit \{[\s\S]*?pointer-events: all/);
});

test("rotated puzzle fragments use their own geometry as the transform origin", () => {
  const fragment = read("../restore/memory-fragment.tsx");

  assert.match(fragment, /hitRef\.current\?\.getBBox\(\)/);
  assert.match(fragment, /transformOrigin/);
  assert.match(fragment, /viewBox\.width/);
  assert.match(fragment, /viewBox\.height/);
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

test("first REMEMBER interaction requests fullscreen without blocking game entry", () => {
  const boot = read("../scenes/boot-scene.tsx");
  const fullscreen = read("./use-remember-fullscreen.ts");
  const experience = read("../remember-experience.tsx");

  assert.match(boot, /onFirstInteraction\?\.\(\)[\s\S]*await onUnlock\(\)/);
  assert.match(fullscreen, /document\.documentElement\.requestFullscreen\(\)/);
  assert.match(fullscreen, /document\.exitFullscreen\(\)/);
  assert.match(fullscreen, /addEventListener\("fullscreenchange"/);
  assert.match(experience, /onFirstInteraction=\{requestFullscreen\}/);
});

test("REMEMBER header exposes a localized fullscreen toggle", () => {
  const shell = read("../remember-shell.tsx");
  const locales = read("../content/remember-locales.ts");

  assert.match(shell, /remember-fullscreen-toggle/);
  assert.match(
    shell,
    /isFullscreen \? copy\.controls\.exitFullscreen : copy\.controls\.fullscreen/,
  );
  assert.match(locales, /fullscreen: "Tela cheia"/);
  assert.match(locales, /exitFullscreen: "Sair da tela cheia"/);
  assert.match(locales, /fullscreen: "Fullscreen"/);
  assert.match(locales, /exitFullscreen: "Exit fullscreen"/);
});

test("epilogue and credits stage cinematic text reveals with reduced-motion fallbacks", () => {
  const epilogue = read("../scenes/epilogue-scene.tsx");
  const credits = read("../scenes/credits-scene.tsx");

  for (const scene of [epilogue, credits]) {
    assert.match(scene, /gsap\.context/);
    assert.match(scene, /gsap\.timeline/);
    assert.match(scene, /reducedMotion/);
  }
  assert.match(epilogue, /filter: "blur\(10px\)"/);
  assert.match(credits, /remember-credits__title/);
  assert.match(credits, /remember-credits__moon/);
});

test("credits offer a secondary replay CTA that creates a fresh Hanamori run", () => {
  const credits = read("../scenes/credits-scene.tsx");
  const locales = read("../content/remember-locales.ts");
  const experience = read("../remember-experience.tsx");

  assert.match(credits, /onReplay/);
  assert.match(credits, /copy\.replay/);
  assert.match(locales, /replay: "REPETIR A EXPERIÊNCIA"/);
  assert.match(locales, /replay: "EXPERIENCE AGAIN"/);
  assert.match(experience, /handleReplayExperience/);
  assert.match(experience, /createNewRememberSave/);
  assert.match(experience, /START_NEW_GAME/);
  assert.match(experience, /getStageAssetManifest\("hanamori"\)/);
});
