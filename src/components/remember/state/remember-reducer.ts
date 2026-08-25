import { initialRememberState, type RememberAction, type RememberState } from "./remember-state.ts";

export function rememberReducer(state: RememberState, action: RememberAction): RememberState {
  switch (action.type) {
    case "ENTER":
      if (state.scene !== "entry") return state;
      return { ...state, scene: "restore" };

    case "RESTORE_FRAGMENT": {
      if (state.scene !== "restore") return state;
      if (state.restoredFragmentIds.includes(action.fragmentId)) return state;

      const restoredFragmentIds = [...state.restoredFragmentIds, action.fragmentId];
      return {
        ...state,
        restoredFragmentIds,
        scene: restoredFragmentIds.length >= action.totalFragments ? "memory-reveal" : state.scene,
      };
    }

    case "SET_MUTED":
      if (state.muted === action.muted) return state;
      return { ...state, muted: action.muted };

    case "RESTART":
      return {
        ...initialRememberState,
        restoredFragmentIds: [],
      };

    default:
      return state;
  }
}
