import assert from "node:assert/strict";
import test from "node:test";

async function loadDefinitions() {
  try {
    return await import("./memory-definitions.ts");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_MODULE_NOT_FOUND"
    ) {
      return { memoryDefinitions: undefined };
    }
    throw error;
  }
}

test("memory definitions are ordered and increase difficulty", async () => {
  const { memoryDefinitions } = await loadDefinitions();

  assert.ok(Array.isArray(memoryDefinitions), "memoryDefinitions must be exported");
  assert.deepEqual(
    memoryDefinitions.map((memory) => memory.id),
    ["hanamori", "mizukyo", "kurogane"],
  );
  assert.deepEqual(
    memoryDefinitions.map((memory) => memory.fragments.length),
    [5, 7, 9],
  );
  assert.ok(memoryDefinitions[0].snapRatio > memoryDefinitions[1].snapRatio);
  assert.ok(memoryDefinitions[1].snapRatio > memoryDefinitions[2].snapRatio);
});

test("every memory has a complete reusable puzzle contract", async () => {
  const { memoryDefinitions } = await loadDefinitions();
  assert.ok(Array.isArray(memoryDefinitions), "memoryDefinitions must be exported");

  for (const memory of memoryDefinitions) {
    assert.deepEqual(memory.viewBox, { width: 1000, height: 625 });
    assert.ok(memory.brokenAsset.startsWith("/"));
    assert.ok(memory.restoredAsset.startsWith("/"));
    assert.ok(memory.seams.length > 0);
    assert.ok(memory.fragments.every((fragment) => fragment.snapRadius >= 0.06));
    assert.ok(memory.fragments.every((fragment) => fragment.snapRadius <= 0.11));
    assert.ok(memory.completionCopy.pt.length > 0);
    assert.ok(memory.completionCopy.en.length > 0);
  }
});
