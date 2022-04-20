import { createContext, Dispatch, useContext, useReducer } from "react";
import { EnactedPolicyInfo, Metadata, Step } from "utils/types";

export interface AppState {
  secret?: string;
  metadata?: Metadata;
  policy?: EnactedPolicyInfo;
  loading: boolean;
  steps: Step[];
  tokenId: number;
}

const initialSteps: Step[] = [
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
  {
    label: "3",
    title: "Encrypt and Mint",
    done: false,
    active: false,
  },
  {
    label: "4",
    title: "Decrypt NFT",
    done: false,
    active: false,
  },
  {
    label: "5",
    title: "Transfer NFT",
    done: false,
    active: false,
  },
];

export const AppInitialState: AppState = {
  loading: true,
  steps: [...initialSteps],
  tokenId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
};

interface AppActions {
  type:
    | "SET_STEP_DONE"
    | "RESET_STEPS"
    | "SET_SECRET"
    | "SET_METADATA"
    | "SET_POLICY";
  payload: any;
}

export const OpenDRMReducer = (
  state: AppState,
  { type, payload }: AppActions
): AppState => {
  console.log("dispatching state", type);
  const _steps = [...state.steps];
  var i = 0;

  switch (type) {
    case "SET_STEP_DONE":
      for (i = 0; i < payload.step; i++) {
        _steps[i].done = true;
        _steps[i].active = false;
      }
      if (payload.step < _steps.length - 1) {
        _steps[payload.step + 1].active = true;
      }

      _steps[payload.step].done = true;
      return { ...state, steps: _steps };
    case "RESET_STEPS":
      for (i = 0; i < _steps.length; i++) {
        _steps[i].done = false;
        _steps[i].active = false;
      }
      _steps[0].active = true;

      return { ...state, steps: _steps };
    case "SET_SECRET":
      return {
        ...state,
        secret: payload.secret,
      };
    case "SET_METADATA":
      return {
        ...state,
        metadata: payload.metadata,
      };
    case "SET_POLICY":
      return {
        ...state,
        policy: payload.policy,
      };
    default:
      return state;
  }
};

export const AppDispatchContext = createContext<Dispatch<AppActions>>(
  (action: AppActions) => {}
);

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
