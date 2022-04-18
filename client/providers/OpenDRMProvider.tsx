import { createContext, Dispatch, useContext, useReducer } from "react";
import { Metadata, Step } from "utils/types";

export interface AppState {
  metadata?: Metadata;
  loading: boolean;
  steps: Step[];
}

interface AppActions {
  type: "SET_STEP_DONE" | "SET_STEP_ACTIVE";
  payload: any;
}

export const OpenDRMReducer = (
  state: AppState,
  { type, payload }: AppActions
): AppState => {
  const _steps = [...state.steps];
  switch (type) {
    case "SET_STEP_DONE":

      _steps[payload.step].done = true;
      return { ...state, steps: _steps };
      
    case "SET_STEP_ACTIVE":

      for (var i = 0; i < _steps.length; i++) {
        _steps[i].active = false;
      }

      _steps[payload.step].active = true;

      return { ...state, steps: _steps };
    default:
      return state;
  }
};

export const AppDispatchContext = createContext<Dispatch<AppActions>>(
  (action: AppActions) => {}
);

export const AppInitialState: AppState = {
  loading: true,
  steps: [
    {
      label: "1",
      title: "Connect Wallet",
      done: false,
      active: true,
    },
    {
      label: "2",
      title: "Register Nu Wallet",
      done: false,
      active: false,
    },
  ],
};

export const AppStateContext = createContext(AppInitialState);

export const OpenDRMProvider = ({ children }: { children: any }) => {
  const [appState, appDispatch] = useReducer(OpenDRMReducer, AppInitialState);

  return (
    <AppDispatchContext.Provider value={appDispatch}>
      <AppStateContext.Provider value={appState}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  );
};

export function useAppState() {
  return useContext(AppStateContext);
}
