import {
  initialRememberState,
  type MemoryId,
  type RememberAction,
  type RememberState,
} from "./remember-state.ts";

const memoryOrder: MemoryId[] = ["hanamori", "mizukyo", "kurogane"];

export function rememberReducer(state: RememberState, action: RememberAction): RememberState {
  switch (action.type) {
    case "UNLOCK_MENU":
      if (state.scene !== "boot") return state;
      return { ...state, scene: "menu" };

    case "BEGIN_GAME":
      if (state.scene !== "menu") return state;
      return {
        ...state,
        scene: "memory",
        activeMemoryIndex: 0,
        completedMemoryIds: [],
        restoredFragmentIds: [],
        restorationPhase: "idle",
      };

    case "RESTORE_FRAGMENT": {
      if (state.scene !== "memory" || state.restorationPhase !== "idle") return state;
      if (state.restoredFragmentIds.includes(action.fragmentId)) return state;

      const restoredFragmentIds = [...state.restoredFragmentIds, action.fragmentId];
      return {
        ...state,
        restoredFragmentIds,
        restorationPhase:
          restoredFragmentIds.length >= action.totalFragments ? "last-piece" : state.restorationPhase,
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

      return {
        ...state,
        completedMemoryIds,
        restorationPhase: "restored",
      };
    }

    case "CONTINUE": {
      if (state.scene === "memory") {
        const activeMemoryId = memoryOrder[state.activeMemoryIndex];
        if (
          state.restorationPhase !== "restored" ||
          !activeMemoryId ||
          !state.completedMemoryIds.includes(activeMemoryId)
        ) {
          return state;
        }

        if (state.activeMemoryIndex < memoryOrder.length - 1) {
          return {
            ...state,
            activeMemoryIndex: state.activeMemoryIndex + 1,
            restoredFragmentIds: [],
            restorationPhase: "idle",
          };
        }

        return {
          ...state,
          scene: "akari-reveal",
          restoredFragmentIds: [],
          restorationPhase: "idle",
        };
      }

      if (state.scene === "akari-reveal") return { ...state, scene: "epilogue" };
      if (state.scene === "epilogue") return { ...state, scene: "credits" };
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
