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
  onPolicyCreated: () => void;
}

export function usePolicy(props: PolicyHook) {
  const { onPolicyCreated, policyId } = props;

  const { library } = useWeb3React<Web3Provider>("Network");
  const handlePolicyCreated: TypedListener<PolicyFulfilledEvent> = (
    policyId
  ) => {
    onPolicyCreated()
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
      openDRM721.on(policyFilter, handlePolicyCreated);
      return () => {
        openDRM721.off(policyFilter, handlePolicyCreated);
      };
    }
  }, [library, policyId]);
}
