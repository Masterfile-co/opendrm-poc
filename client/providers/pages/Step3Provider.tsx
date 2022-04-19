import { createContext, Dispatch, useContext, useReducer } from "react";
import { Step } from "utils/types";

export interface Step3State {
  steps: Step[];
  loading: boolean;
  cleartext: string;
}

export const Step3InitialState: Step3State = {
  steps: [
    { label: "A", title: "Encrypt", done: false, active: true },
    { label: "B", title: "Mint", done: false, active: false },
    { label: "C", title: "Policy", done: false, active: false },
  ],
  loading: false,
  cleartext: "",
};

interface Step3Actions {
  type: "SET_STEP_DONE" | "SET_CLEARTEXT" | "SET_LOADING";
  payload: any;
}

export const Step3Reducer = (
  state: Step3State,
  { type, payload }: Step3Actions
): Step3State => {
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
    case "SET_CLEARTEXT":
      return { ...state, cleartext: payload.cleartext };
    case "SET_LOADING":
      return { ...state, loading: payload.loading };
    default:
      return state;
  }
};

export const Step3DispatchContext = createContext<Dispatch<Step3Actions>>(
  (action: Step3Actions) => {}
);

export const Step3StateContext = createContext(Step3InitialState);

export const Step3Provider = ({ children }: { children: any }) => {
  const [step3State, step3Dispatch] = useReducer(
    Step3Reducer,
    Step3InitialState
  );

  return (
    <Step3DispatchContext.Provider value={step3Dispatch}>
      <Step3StateContext.Provider value={step3State}>
        {children}
      </Step3StateContext.Provider>
    </Step3DispatchContext.Provider>
  );
};

export function useStep3State() {
  return useContext(Step3StateContext);
}
