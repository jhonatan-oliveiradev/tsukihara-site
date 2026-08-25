import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const experience = fs.readFileSync(new URL("../remember-experience.tsx", import.meta.url), "utf8");

test("organic continuation uses the canonical stage graph instead of memory-array adjacency", () => {
  assert.match(experience, /getNextStage/);
  assert.match(experience, /getNextStage\(state\.currentStage\)/);
  assert.match(experience, /getStageAssetManifest\(nextStage\)/);
  assert.doesNotMatch(experience, /memoryDefinitions\[state\.activeMemoryIndex \+ 1\]/);
});

test("Interlude I has a real scene renderer in the REMEMBER composition root", () => {
  assert.match(experience, /Interlude01Scene/);
  assert.match(experience, /state\.currentStage === "interlude-01"/);
});

test("AKR-001 discovery and the finale cannot fall through to the empty REMEMBER shell", () => {
  assert.match(experience, /Interlude02Scene/);
  assert.match(experience, /state\.currentStage === "interlude-02"/);
  assert.match(experience, /MemoryRevealScene/);
  assert.match(experience, /state\.scene === "akari-reveal"/);
  assert.match(experience, /EpilogueScene/);
  assert.match(experience, /state\.scene === "epilogue"/);
  assert.match(experience, /CreditsScene/);
  assert.match(experience, /state\.scene === "credits"/);
});
