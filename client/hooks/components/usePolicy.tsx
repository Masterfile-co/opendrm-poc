import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { OpenDRM721__factory } from "types";
import { TypedListener } from "types/common";
import { PolicyFulfilledEvent } from "types/OpenDRM721";
import { OPENDRM721_ADDRESS } from "utils/constants";

export interface PolicyHook {
  setStepDone: (stepIndex: number) => void;
}

export function usePolicy(props: PolicyHook) {
  const { push } = useRouter();
  const { library } = useWeb3React<Web3Provider>("Network");
  const { setStepDone } = props;
  const handlePolicyCreated: TypedListener<PolicyFulfilledEvent> = (
    policyId
  ) => {
    setStepDone(2);
    push("/step4");
  };

  useEffect(() => {
    if (library) {
      const openDRM721 = OpenDRM721__factory.connect(
        OPENDRM721_ADDRESS,
        library
      );
      // TODO: filter for policy id
      const policyFilter = openDRM721.filters.PolicyFulfilled();
      openDRM721.on(policyFilter, handlePolicyCreated);
      return () => {
        openDRM721.off(policyFilter, handlePolicyCreated);
      };
    }
  }, [library]);
}
