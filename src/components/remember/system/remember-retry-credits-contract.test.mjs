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

test("memory result offers an in-place retry while preserving the canonical continue path", () => {
  const experience = read("../remember-experience.tsx");
  const restore = read("../scenes/restore-scene.tsx");
  const locales = read("../content/remember-locales.ts");

  assert.match(experience, /chooseBestMemoryResult/);
  assert.match(experience, /handleRetryMemoryResult/);
  assert.match(experience, /type: "RESTART_MEMORY"/);
  assert.match(experience, /memoryAttemptKey/);
  assert.match(experience, /latestAttemptResult/);
  assert.match(restore, /onRetry/);
  assert.match(restore, /copy\.retryMemory/);
  assert.match(restore, /copy\.newBest/);
  assert.match(restore, /copy\.bestMaintained/);
  assert.match(restore, /copy\.bestRecord/);
  assert.match(locales, /retryMemory: "REPETIR MEMÓRIA"/);
  assert.match(locales, /retryMemory: "RETRY MEMORY"/);
  assert.match(locales, /newBest: "NOVO MELHOR RESULTADO"/);
  assert.match(locales, /bestMaintained: "MELHOR REGISTRO MANTIDO"/);
});

test("final credits include a bottom-right upward rolling creator easter egg", () => {
  const credits = read("../scenes/credits-scene.tsx");
  const locales = read("../content/remember-locales.ts");
  const styles = read("../../../app/remember/remember-cinematic.css");

  assert.match(credits, /remember-credits__roll-viewport/);
  assert.match(credits, /remember-credits__roll-track/);
  assert.match(credits, /JHONATAN OLIVEIRA/);
  assert.match(credits, /copy\.creditRoles\.map/);
  assert.match(locales, /creditRoles:/);
  assert.match(locales, /Direção de Arte/);
  assert.match(locales, /Restaurador Oficial de Memórias/);
  assert.match(locales, /Art Direction/);
  assert.match(locales, /Official Memory Restorer/);
  assert.match(styles, /@keyframes remember-credits-roll/);
  assert.match(styles, /translateY\(100%\)/);
  assert.match(styles, /translateY\(-100%\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.remember-credits__roll-track[\s\S]*animation: none/);
});

test("reduced-motion credits remain fully visible instead of clipping the static list", () => {
  const styles = read("../../../app/remember/remember-cinematic.css");

  assert.match(
    styles,
    /\.remember-credits__roll-viewport\.is-static\s*\{[\s\S]*max-height:\s*none;[\s\S]*overflow:\s*visible;/,
  );
});

test("final credits preserve readable contrast against the global vignette", () => {
  const styles = read("../../../app/remember/remember-cinematic.css");

  assert.match(styles, /\[data-remember-scene="credits"\] \.remember-root__vignette/);
  assert.match(styles, /\.remember-credits__credit strong\s*\{[\s\S]*\/ 0\.9[0-9]\)/);
  assert.match(styles, /\.remember-credits__credit small\s*\{[\s\S]*\/ 0\.[5-9][0-9]\)/);
});

test("Gekkai reserves Space for Lunar Focus while fragment keyboard restore remains on Enter", () => {
  const puzzle = read("../restore/memory-puzzle.tsx");
  const fragment = read("../restore/memory-fragment.tsx");

  assert.match(puzzle, /event\.stopPropagation\(\)/);
  assert.match(puzzle, /remember-fragment__hit/);
  assert.match(puzzle, /addEventListener\("keydown", handleFocusKey, true\)/);
  assert.match(puzzle, /removeEventListener\("keydown", handleFocusKey, true\)/);
  assert.match(fragment, /if \(event\.key !== "Enter" && event\.key !== " "\) return;/);
});
