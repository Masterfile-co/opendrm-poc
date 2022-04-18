import { AppDispatchContext } from "providers/OpenDRMProvider";
import { useContext } from "react";

export function useOpenDRM() {
  const dispatch = useContext(AppDispatchContext);

  const setStepDone = (step: number) => {
    dispatch({ type: "SET_STEP_DONE", payload: { step } });
  };

  const setStepActive = (step: number) => {};

  return { setStepDone, setStepActive };
}
