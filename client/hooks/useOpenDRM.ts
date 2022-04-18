import { Web3Provider } from "@ethersproject/providers";
import { Bob, defaultConfiguration } from "@nucypher/nucypher-ts";
import { ChainId } from "@nucypher/nucypher-ts/build/main/src/types";
import { useWeb3React } from "@web3-react/core";
import { AppDispatchContext } from "providers/OpenDRMProvider";
import { useContext } from "react";
import { OpenDRMCoordinator__factory } from "types";
import { toSecretKey } from "utils";
import { OPENDRM_COORDINATOR } from "utils/constants";

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


  return { setStepDone, resetSteps, setSecret };
}
