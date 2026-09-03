import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const worldCanvasPath = fileURLToPath(new URL("./world-canvas.tsx", import.meta.url));
const reducedMotionPath = fileURLToPath(new URL("./use-reduced-motion.ts", import.meta.url));
const heroTimelinePath = fileURLToPath(
  new URL("./hero/hooks/use-hero-timeline.ts", import.meta.url),
);

test("world canvas honors reduced motion with an on-demand render loop", () => {
  const source = readFileSync(worldCanvasPath, "utf8");
  const reducedMotionSource = readFileSync(reducedMotionPath, "utf8");

  assert.match(reducedMotionSource, /prefers-reduced-motion: reduce/);
  assert.match(source, /const reducedMotion = useReducedMotion\(\)/);
  assert.match(source, /frameloop=\{reducedMotion \? "demand" : "always"\}/);
  assert.match(source, /dpr=\{reducedMotion \? 1 : \[1, 1\.75\]\}/);
  assert.match(source, /\{!reducedMotion && \(/);
  assert.match(source, /<PointerEmbers \/>/);
});

test("hero reduced-motion path does not schedule a ScrollTrigger refresh", () => {
  const source = readFileSync(heroTimelinePath, "utf8");

  assert.match(
    source,
    /const refreshFrame = reduced\s*\? undefined\s*:\s*window\.requestAnimationFrame/,
  );
});
