import assert from "node:assert/strict";
import test from "node:test";
import { memoryDefinitions } from "../content/memory-definitions.ts";
import { createScatterLayout, getScatterRotationRange } from "./scatter-layout.ts";

const standardMemories = memoryDefinitions.filter((memory) => memory.mechanic === "standard");

const desktop = { width: 1200, height: 750, mobile: false };
const mobile = { width: 390, height: 640, mobile: true };

test("scatter layout is deterministic per seed and changes with a new seed", () => {
  for (const memory of standardMemories) {
    const first = createScatterLayout(memory, 481516, desktop);
    const same = createScatterLayout(memory, 481516, desktop);
    const different = createScatterLayout(memory, 815162, desktop);

    assert.deepEqual(first, same);
    assert.notDeepEqual(first, different);
  }
});

test("standard-memory fragments begin well outside their snap radius and inside safe bounds", () => {
  for (const memory of standardMemories) {
    const layout = createScatterLayout(memory, 108, desktop);
    const minimumDimension = Math.min(desktop.width, desktop.height);

    for (const fragment of memory.fragments) {
      const point = layout[fragment.id];
      assert.ok(point, `missing scatter point for ${fragment.id}`);

      const snapRadius = Math.max(36, fragment.snapRadius * minimumDimension);
      assert.ok(Math.hypot(point.x, point.y) > snapRadius * 1.9, `${fragment.id} starts too close`);
      assert.ok(Math.abs(point.x) <= desktop.width * 0.43, `${fragment.id} escapes horizontal safe zone`);
      assert.ok(Math.abs(point.y) <= desktop.height * 0.36, `${fragment.id} escapes vertical safe zone`);
      assert.ok(
        Math.abs(point.x) >= desktop.width * 0.22 || Math.abs(point.y) >= desktop.height * 0.2,
        `${fragment.id} is not peripheral enough`,
      );

      const range = getScatterRotationRange(memory.id);
      assert.ok(Math.abs(point.rotation) >= range.min);
      assert.ok(Math.abs(point.rotation) <= range.max);
    }
  }
});

test("rotation difficulty escalates across the three standard memories", () => {
  assert.deepEqual(getScatterRotationRange("hanamori"), { min: 8, max: 15 });
  assert.deepEqual(getScatterRotationRange("mizukyo"), { min: 12, max: 20 });
  assert.deepEqual(getScatterRotationRange("kurogane"), { min: 16, max: 28 });
});

test("mobile scatter uses its own composition instead of scaled desktop coordinates", () => {
  const memory = standardMemories[0];
  assert.ok(memory);

  const desktopLayout = createScatterLayout(memory, 42, desktop);
  const mobileLayout = createScatterLayout(memory, 42, mobile);
  const fragmentId = memory.fragments[0].id;

  assert.notEqual(
    Math.round((desktopLayout[fragmentId].x / desktop.width) * 1000),
    Math.round((mobileLayout[fragmentId].x / mobile.width) * 1000),
  );
});
