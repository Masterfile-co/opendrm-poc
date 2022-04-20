import { createContext, Dispatch, useContext, useReducer } from "react";
import { Step } from "utils/types";

export interface Step5State {
  steps: Step[];
  bobCleartext?: string;
  loading: boolean;
}

export const Step5InitialState: Step5State = {
  steps: [
    { label: "A", title: "Transfer", done: false, active: true },
    { label: "B", title: "Decrypt", done: false, active: false },
  ],
  loading: false,
};

interface Step5Actions {
  type: "SET_STEP_DONE" | "SET_BOB_CLEARTEXT" | "SET_LOADING";
  payload: any;
}

export const Step5Reducer = (
  state: Step5State,
  { type, payload }: Step5Actions
): Step5State => {
  const _steps = [...state.steps];
  var i = 0;

  switch (type) {
    case "SET_STEP_DONE":
      for (i = 0; i <= payload.step; i++) {
        _steps[i].done = true;
        _steps[i].active = false;
      }
      if (payload.step < _steps.length - 1) {
        _steps[payload.step + 1].active = true;
      }

      _steps[payload.step].done = true;
      return { ...state, steps: _steps };
    case "SET_BOB_CLEARTEXT":
      return { ...state, bobCleartext: payload.bobCleartext };
    case "SET_LOADING":
      return { ...state, loading: payload.loading };
    default:
      return state;
  }
};

export const Step5DispatchContext = createContext<Dispatch<Step5Actions>>(
  (action: Step5Actions) => {}
);

export const Step5StateContext = createContext(Step5InitialState);

export const Step5Provider = ({ children }: { children: any }) => {
  const [step5State, step5Dispatch] = useReducer(
    Step5Reducer,
    Step5InitialState
  );

  return (
    <Step5DispatchContext.Provider value={step5Dispatch}>
      <Step5StateContext.Provider value={step5State}>
        {children}
      </Step5StateContext.Provider>
    </Step5DispatchContext.Provider>
  );
};

export function useStep5State() {
  return useContext(Step5StateContext);
}
