import assert from "node:assert/strict";
import test from "node:test";
import {
  createNewRememberSave,
  loadRememberSave,
  serializeRememberSave,
} from "./remember-save.ts";

const now = "2026-08-25T16:00:00.000Z";

test("new REMEMBER saves start at Hanamori with no derived archive field", () => {
  const save = createNewRememberSave(now);
  assert.equal(save.version, 1);
  assert.equal(save.currentStage, "hanamori");
  assert.equal(save.startedAt, now);
  assert.equal(save.updatedAt, now);
  assert.deepEqual(save.completedStages, []);
  assert.deepEqual(save.memoryProgress, {});
  assert.deepEqual(save.memories, {});
  assert.equal(save.discoveredAkariRecord, false);
  assert.equal(save.gameCompleted, false);
  assert.equal("archiveProgress" in save, false);
});

test("save v1 round-trips through serialized localStorage data", () => {
  const save = createNewRememberSave(now);
  const hydrated = loadRememberSave(serializeRememberSave(save));
  assert.deepEqual(hydrated, save);
});

test("corrupted, unsupported, or structurally invalid saves are ignored safely", () => {
  assert.equal(loadRememberSave(null), null);
  assert.equal(loadRememberSave("{broken"), null);
  assert.equal(loadRememberSave(JSON.stringify({ version: 2 })), null);

  const unknownStage = {
    ...createNewRememberSave(now),
    currentStage: "unknown-stage",
  };
  assert.equal(loadRememberSave(JSON.stringify(unknownStage)), null);

  const negativeMetric = {
    ...createNewRememberSave(now),
    memoryProgress: {
      hanamori: {
        restoredFragmentIds: [],
        elapsedMs: -1,
        mistakes: 0,
        falseFragments: 0,
      },
    },
  };
  assert.equal(loadRememberSave(JSON.stringify(negativeMetric)), null);

  const unknownMemory = {
    ...createNewRememberSave(now),
    memories: {
      moon: {
        completed: true,
        completedAt: now,
        completionTime: 10,
        mistakes: 0,
        falseFragments: 0,
        integrity: 100,
        resonance: "S",
      },
    },
  };
  assert.equal(loadRememberSave(JSON.stringify(unknownMemory)), null);
});

test("valid partial progress and completed results hydrate without pixel positions", () => {
  const save = {
    ...createNewRememberSave(now),
    currentStage: "yumegakure",
    completedStages: ["hanamori", "mizukyo", "interlude-01", "kurogane"],
    memoryProgress: {
      yumegakure: {
        restoredFragmentIds: ["yumegakure-a", "yumegakure-b"],
        startedAt: now,
        elapsedMs: 90500,
        mistakes: 1,
        falseFragments: 1,
      },
    },
    memories: {
      hanamori: {
        completed: true,
        completedAt: now,
        completionTime: 73,
        mistakes: 0,
        falseFragments: 0,
        integrity: 98,
        resonance: "S",
      },
    },
  };

  const hydrated = loadRememberSave(JSON.stringify(save));
  assert.deepEqual(hydrated, save);
  assert.equal("x" in hydrated.memoryProgress.yumegakure, false);
  assert.equal("y" in hydrated.memoryProgress.yumegakure, false);
});
