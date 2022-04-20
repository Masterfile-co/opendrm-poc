import { AppDispatchContext } from "providers/OpenDRMProvider";
import { useContext } from "react";
import { EnactedPolicyInfo, Metadata } from "utils/types";

export function useOpenDRM() {
  const dispatch = useContext(AppDispatchContext);

  const setStepDone = (step: number) => {
    dispatch({ type: "SET_STEP_DONE", payload: { step } });
  };

  const resetSteps = () => {
    dispatch({ type: "RESET_STEPS", payload: null });
  };

  const setSecret = (secret: string) => {
    localStorage.setItem("nu_sk", secret);
    dispatch({ type: "SET_SECRET", payload: { secret } });
  };

  const setMetadata = (metadata: Metadata) => {
    dispatch({ type: "SET_METADATA", payload: { metadata } });
  };

  const setPolicy = (policy: EnactedPolicyInfo) => {
    dispatch({ type: "SET_POLICY", payload: { policy } });
  };

  return { setStepDone, resetSteps, setSecret, setMetadata, setPolicy };
}
