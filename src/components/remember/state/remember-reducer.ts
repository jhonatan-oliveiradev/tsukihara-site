import { isMemoryStage } from "./remember-progression.ts";
import {
  initialRememberState,
  type MemoryId,
  type RememberAction,
  type RememberScene,
  type RememberStageId,
  type RememberState,
} from "./remember-state.ts";

const memoryOrder: MemoryId[] = ["hanamori", "mizukyo", "kurogane", "yumegakure", "gekkai"];
const legacyMemoryOrder: MemoryId[] = ["hanamori", "mizukyo", "kurogane"];

const sceneForStage = (stage: RememberStageId): RememberScene => {
  if (isMemoryStage(stage)) return "memory";
  if (stage === "interlude-01" || stage === "interlude-02") return "interlude";
  if (stage === "akari-reveal") return "akari-reveal";
  if (stage === "epilogue") return "epilogue";
  return "credits";
};

const memoryIndexForStage = (stage: RememberStageId) => {
  if (!isMemoryStage(stage)) return 0;
  const index = memoryOrder.indexOf(stage);
  return index >= 0 ? index : 0;
};

const resetPuzzleRuntime = (state: RememberState): RememberState => ({
  ...state,
  restoredFragmentIds: [],
  restorationPhase: "idle",
});

const startFreshGame = (state: RememberState): RememberState => ({
  ...initialRememberState,
  scene: "memory",
  locale: state.locale,
  muted: state.muted,
});

export function rememberReducer(state: RememberState, action: RememberAction): RememberState {
  switch (action.type) {
    case "UNLOCK_MENU":
      if (state.scene !== "boot") return state;
      return { ...state, scene: "menu" };

    case "BEGIN_GAME":
      if (state.scene !== "menu") return state;
      return startFreshGame(state);

    case "START_NEW_GAME":
      return startFreshGame(state);

    case "HYDRATE_SAVE": {
      const completedMemoryIds = memoryOrder.filter(
        (memoryId) =>
          action.save.completedStages.includes(memoryId) ||
          action.save.memories[memoryId]?.completed === true,
      );
      const restoredFragmentIds = isMemoryStage(action.save.currentStage)
        ? (action.save.memoryProgress[action.save.currentStage]?.restoredFragmentIds ?? [])
        : [];

      return {
        ...state,
        scene: sceneForStage(action.save.currentStage),
        currentStage: action.save.currentStage,
        completedStages: [...action.save.completedStages],
        completedMemoryIds,
        activeMemoryIndex: memoryIndexForStage(action.save.currentStage),
        restoredFragmentIds: [...restoredFragmentIds],
        restorationPhase: "idle",
        paused: false,
        archiveOpen: false,
      };
    }

    case "ENTER_STAGE":
      return resetPuzzleRuntime({
        ...state,
        scene: sceneForStage(action.stage),
        currentStage: action.stage,
        activeMemoryIndex: memoryIndexForStage(action.stage),
        paused: false,
        archiveOpen: false,
      });

    case "COMPLETE_STAGE": {
      const completedStages = state.completedStages.includes(action.stage)
        ? state.completedStages
        : [...state.completedStages, action.stage];
      const completedMemoryIds = isMemoryStage(action.stage)
        ? state.completedMemoryIds.includes(action.stage)
          ? state.completedMemoryIds
          : [...state.completedMemoryIds, action.stage]
        : state.completedMemoryIds;

      return { ...state, completedStages, completedMemoryIds };
    }

    case "OPEN_PAUSE":
      if (state.scene !== "memory" && state.scene !== "interlude") return state;
      return state.paused ? state : { ...state, paused: true };

    case "CLOSE_PAUSE":
      return state.paused ? { ...state, paused: false } : state;

    case "OPEN_ARCHIVE":
      return state.archiveOpen ? state : { ...state, archiveOpen: true };

    case "CLOSE_ARCHIVE":
      return state.archiveOpen ? { ...state, archiveOpen: false } : state;

    case "RESTART_MEMORY":
      return resetPuzzleRuntime({ ...state, paused: false, archiveOpen: false });

    case "RESTORE_FRAGMENT": {
      if (state.scene !== "memory" || state.restorationPhase !== "idle" || state.paused)
        return state;
      if (state.restoredFragmentIds.includes(action.fragmentId)) return state;

      const restoredFragmentIds = [...state.restoredFragmentIds, action.fragmentId];
      return {
        ...state,
        restoredFragmentIds,
        restorationPhase:
          restoredFragmentIds.length >= action.totalFragments
            ? "last-piece"
            : state.restorationPhase,
      };
    }

    case "SET_RESTORATION_PHASE":
      if (state.scene !== "memory" || state.restorationPhase === action.phase) return state;
      return { ...state, restorationPhase: action.phase };

    case "MARK_MEMORY_RESTORED": {
      if (state.scene !== "memory") return state;
      const activeMemoryId = memoryOrder[state.activeMemoryIndex];
      if (action.memoryId !== activeMemoryId) return state;

      const completedMemoryIds = state.completedMemoryIds.includes(action.memoryId)
        ? state.completedMemoryIds
        : [...state.completedMemoryIds, action.memoryId];
      const completedStages = state.completedStages.includes(action.memoryId)
        ? state.completedStages
        : [...state.completedStages, action.memoryId];

      return {
        ...state,
        completedMemoryIds,
        completedStages,
        restorationPhase: "restored",
      };
    }

    case "CONTINUE": {
      if (state.scene === "memory") {
        const activeMemoryId = legacyMemoryOrder[state.activeMemoryIndex];
        if (
          state.restorationPhase !== "restored" ||
          !activeMemoryId ||
          !state.completedMemoryIds.includes(activeMemoryId)
        ) {
          return state;
        }

        if (state.activeMemoryIndex < legacyMemoryOrder.length - 1) {
          const nextIndex = state.activeMemoryIndex + 1;
          return {
            ...state,
            currentStage: legacyMemoryOrder[nextIndex],
            activeMemoryIndex: nextIndex,
            restoredFragmentIds: [],
            restorationPhase: "idle",
          };
        }

        return {
          ...state,
          scene: "akari-reveal",
          currentStage: "akari-reveal",
          restoredFragmentIds: [],
          restorationPhase: "idle",
        };
      }

      if (state.scene === "akari-reveal") {
        return { ...state, scene: "epilogue", currentStage: "epilogue" };
      }
      if (state.scene === "epilogue") {
        return { ...state, scene: "credits", currentStage: "credits" };
      }
      return state;
    }

    case "SET_LOCALE":
      if (state.locale === action.locale) return state;
      return { ...state, locale: action.locale };

    case "SET_MUTED":
      if (state.muted === action.muted) return state;
      return { ...state, muted: action.muted };

    case "RESTART":
      return {
        ...initialRememberState,
        locale: state.locale,
        muted: state.muted,
      };

    default:
      return state;
  }
}
