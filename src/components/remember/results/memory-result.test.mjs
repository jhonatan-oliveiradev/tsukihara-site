import assert from "node:assert/strict";
import test from "node:test";

const loadResult = async () => {
  try {
    return await import("./memory-result.ts");
  } catch (error) {
    assert.fail(`Memory Result policy is missing: ${String(error)}`);
  }
};

test("integrity follows the approved mistakes, false-memory, and overtime formula", async () => {
  const result = await loadResult();

  assert.equal(
    result.calculateIntegrity({
      mistakes: 2,
      falseFragments: 1,
      completionTime: 180,
      parSeconds: 120,
    }),
    82,
  );
  assert.equal(
    result.calculateIntegrity({
      mistakes: 0,
      falseFragments: 0,
      completionTime: 119.9,
      parSeconds: 120,
    }),
    100,
  );
  assert.equal(
    result.calculateIntegrity({
      mistakes: 99,
      falseFragments: 99,
      completionTime: 3600,
      parSeconds: 120,
    }),
    0,
  );
});

test("resonance thresholds are S 95+, A 85+, B 70+, otherwise C", async () => {
  const result = await loadResult();

  assert.equal(result.resonanceForIntegrity(100), "S");
  assert.equal(result.resonanceForIntegrity(95), "S");
  assert.equal(result.resonanceForIntegrity(94), "A");
  assert.equal(result.resonanceForIntegrity(85), "A");
  assert.equal(result.resonanceForIntegrity(84), "B");
  assert.equal(result.resonanceForIntegrity(70), "B");
  assert.equal(result.resonanceForIntegrity(69), "C");
  assert.equal(result.resonanceForIntegrity(0), "C");
});

test("completed result persists the exact progress metrics before continuation", async () => {
  const result = await loadResult();
  const completedAt = "2026-08-26T03:00:00.000Z";

  assert.deepEqual(
    result.createMemoryResult({
      progress: {
        restoredFragmentIds: ["a", "b"],
        startedAt: "2026-08-26T02:58:00.000Z",
        elapsedMs: 120000,
        mistakes: 1,
        falseFragments: 2,
      },
      completionTime: 120,
      parSeconds: 120,
      completedAt,
    }),
    {
      completed: true,
      completedAt,
      completionTime: 120,
      mistakes: 1,
      falseFragments: 2,
      integrity: 81,
      resonance: "B",
    },
  );
});
