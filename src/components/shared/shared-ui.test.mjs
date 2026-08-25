import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("shared sound control preserves the landing-page three-bar contract", () => {
  const shared = read("./sound-toggle.tsx");
  assert.match(shared, /aria-pressed={!muted}/);
  assert.match(shared, /shared-sound-bars/);
  assert.equal((shared.match(/<i\s*\/>/g) ?? []).length, 3);
});

test("experience jp reveal becomes a compatibility re-export", () => {
  const legacy = read("../experience/jp-reveal-text.tsx");
  assert.match(legacy, /components\/shared\/jp-reveal-text/);
});
