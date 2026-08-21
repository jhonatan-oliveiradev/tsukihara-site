import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const hookPath = fileURLToPath(new URL("./hooks/use-hero-timeline.ts", import.meta.url));

test("hero timeline does not reference ctx during gsap.context initialization", () => {
  const source = readFileSync(hookPath, "utf8");
  assert.equal(source.includes("ctx.add("), false);
});
