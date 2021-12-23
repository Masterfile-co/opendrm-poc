import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { zeroPad } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { OpenDRM721__factory } from "types";
import { TypedListener } from "types/common";
import { PolicyFulfilledEvent } from "types/OpenDRM721";
import { OPENDRM721_ADDRESS } from "utils/constants";

export interface PolicyHook {
  policyId: string | undefined;
  setStepDone: (stepIndex: number) => void;
}

export function usePolicy(props: PolicyHook) {
  const { setStepDone, policyId } = props;
  const { push } = useRouter();
  const { library } = useWeb3React<Web3Provider>("Network");
  const handlePolicyCreated: TypedListener<PolicyFulfilledEvent> = (
    policyId
  ) => {
    setStepDone(2);
    push("/step4");
  };

  useEffect(() => {
    if (library && policyId) {
      const openDRM721 = OpenDRM721__factory.connect(
        OPENDRM721_ADDRESS,
        library
      );
      // TODO: filter for policy id
      const policyFilter = openDRM721.filters.PolicyFulfilled(
        `${policyId}00000000000000000000000000000000`
      );
      console.log(policyFilter);
      openDRM721.on(policyFilter, handlePolicyCreated);
      return () => {
        openDRM721.off(policyFilter, handlePolicyCreated);
      };
    }
  }, [library, policyId]);
}
