import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("./memory-restoration-effect.tsx", import.meta.url);

test("restoration effect stays restartable when React StrictMode replays layout effects", async () => {
  const source = await fs.readFile(sourceUrl, "utf8");

  assert.doesNotMatch(source, /ranMemoryRef/);
  assert.match(source, /return \(\) => ctx\.revert\(\)/);
});
