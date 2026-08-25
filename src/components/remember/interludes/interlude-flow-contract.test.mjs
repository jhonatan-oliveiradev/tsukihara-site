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
