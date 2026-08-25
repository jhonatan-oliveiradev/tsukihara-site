import assert from "node:assert/strict";
import test from "node:test";

async function loadPolicy() {
  try {
    return await import("./archive-policy.ts");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_MODULE_NOT_FOUND"
    ) {
      return {};
    }
    throw error;
  }
}

const incompleteSave = {
  version: 1,
  startedAt: "2026-08-25T18:00:00.000Z",
  updatedAt: "2026-08-25T18:05:00.000Z",
  currentStage: "mizukyo",
  completedStages: ["hanamori"],
  memoryProgress: {
    mizukyo: {
      restoredFragmentIds: ["mizukyo-01", "mizukyo-02"],
      elapsedMs: 19000,
      mistakes: 0,
      falseFragments: 0,
    },
  },
  memories: {
    hanamori: {
      completed: true,
      completedAt: "2026-08-25T18:04:00.000Z",
      completionTime: 43000,
      mistakes: 0,
      falseFragments: 0,
      integrity: 100,
      resonance: "S",
    },
  },
  discoveredAkariRecord: false,
  gameCompleted: false,
};

const completedSave = {
  ...incompleteSave,
  currentStage: "credits",
  completedStages: [
    "hanamori",
    "mizukyo",
    "interlude-01",
    "kurogane",
    "yumegakure",
    "gekkai",
    "interlude-02",
    "akari-reveal",
    "epilogue",
    "credits",
  ],
  memories: {
    hanamori: incompleteSave.memories.hanamori,
    mizukyo: incompleteSave.memories.hanamori,
    kurogane: incompleteSave.memories.hanamori,
    yumegakure: incompleteSave.memories.hanamori,
    gekkai: incompleteSave.memories.hanamori,
  },
  discoveredAkariRecord: true,
  gameCompleted: true,
};

test("title menu policy distinguishes new, continue, and completed saves", async () => {
  const { getTitleMenuPolicy } = await loadPolicy();
  assert.equal(typeof getTitleMenuPolicy, "function");

  assert.deepEqual(getTitleMenuPolicy(null), {
    primary: "new-game",
    showNewGame: false,
    stage: null,
  });
  assert.deepEqual(getTitleMenuPolicy(incompleteSave), {
    primary: "continue",
    showNewGame: true,
    stage: "mizukyo",
  });
  assert.deepEqual(getTitleMenuPolicy(completedSave), {
    primary: "revisit",
    showNewGame: true,
    stage: null,
  });
});

test("archive progress is derived only from unique completed memories", async () => {
  const { deriveArchiveProgress } = await loadPolicy();
  assert.equal(typeof deriveArchiveProgress, "function");

  assert.equal(deriveArchiveProgress([]), 0);
  assert.equal(deriveArchiveProgress(["hanamori"]), 20);
  assert.equal(deriveArchiveProgress(["hanamori", "mizukyo"]), 40);
  assert.equal(deriveArchiveProgress(["hanamori", "mizukyo", "kurogane"]), 60);
  assert.equal(deriveArchiveProgress(["hanamori", "mizukyo", "kurogane", "yumegakure"]), 80);
  assert.equal(
    deriveArchiveProgress(["hanamori", "mizukyo", "kurogane", "yumegakure", "gekkai"]),
    100,
  );
  assert.equal(deriveArchiveProgress(["hanamori", "hanamori"]), 20);
});

test("archive records stay non-navigable until post-game replay", async () => {
  const { getArchiveRecordState, canOpenArchiveRecord } = await loadPolicy();
  assert.equal(typeof getArchiveRecordState, "function");
  assert.equal(typeof canOpenArchiveRecord, "function");

  const restored = getArchiveRecordState({
    memoryId: "hanamori",
    completedMemoryIds: ["hanamori"],
    currentStage: "mizukyo",
  });
  const unstable = getArchiveRecordState({
    memoryId: "mizukyo",
    completedMemoryIds: ["hanamori"],
    currentStage: "mizukyo",
  });
  const unknown = getArchiveRecordState({
    memoryId: "kurogane",
    completedMemoryIds: ["hanamori"],
    currentStage: "mizukyo",
  });

  assert.equal(restored, "RESTORED");
  assert.equal(unstable, "UNSTABLE");
  assert.equal(unknown, "UNKNOWN");
  assert.equal(canOpenArchiveRecord(false, restored), false);
  assert.equal(canOpenArchiveRecord(true, restored), true);
  assert.equal(canOpenArchiveRecord(true, unstable), false);
});

test("AKR-001 remains locked until the explicit discovery flag is persisted", async () => {
  const { getAkariArchiveRecordState } = await loadPolicy();
  assert.equal(typeof getAkariArchiveRecordState, "function");
  assert.equal(getAkariArchiveRecordState(false), "LOCKED");
  assert.equal(getAkariArchiveRecordState(true), "RESTORED");
});
