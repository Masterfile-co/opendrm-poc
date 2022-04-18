import { useWeb3React } from "@web3-react/core";
import { useOpenDRM } from "hooks/useOpenDRM";
import React, { useContext, useEffect } from "react";
import { AppDispatchContext, useAppState } from "./OpenDRMProvider";

export default function OpenDRMManager() {
  const { account } = useWeb3React();
  const { setStepDone } = useOpenDRM();
  
  useEffect(() => {
    if (account) {
      setStepDone(0);
    }
  }, [account]);

  return <></>;
}
