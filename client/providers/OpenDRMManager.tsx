import { useWeb3React } from "@web3-react/core";
import { useOpenDRM } from "hooks/useOpenDRM";
import React, { useContext, useEffect, useState } from "react";
import { AppDispatchContext, useAppState } from "./OpenDRMProvider";

export default function OpenDRMManager() {
  const { account } = useWeb3React();
  const { setStepDone, resetSteps, setSecret } = useOpenDRM();
  const { secret } = useAppState();

  // if connected, initialize step 1 as done
  // if disconnect, start over
  useEffect(() => {
    if (account) {
      setStepDone(0);
    }
    if (!account) {
      resetSteps();
    }
  }, [account]);

  // Load previous secret if possible
  useEffect(() => {
    const secret = localStorage.getItem("nu_sk");

    if (secret) {
      //TODO: check secret against registry
      setSecret(secret);
    }
  }, []);

  useEffect(() => {
    if (secret && account) {
      setStepDone(1);
    }
  }, [secret, account]);

  return <></>;
}
