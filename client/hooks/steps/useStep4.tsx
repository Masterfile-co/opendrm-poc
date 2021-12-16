import { utils } from "ethers";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { Bob, EnactedPolicy } from "nucypher-ts";
import { useEffect, useState } from "react";
import { OpenDRM721 } from "types";
import { TypedListener } from "types/common";
import { PolicyFulfilledEvent } from "types/OpenDRM721";

interface Step4 {
  label: string;
  nuUser: Bob | null;
  openDRM721: OpenDRM721 | null;
}

/**
 * Step 4 waits for policy to get created and decrypts
 * @returns
 */
export function useStep4(props: Step4) {
  const { label, nuUser, openDRM721 } = props;
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [policyId, setPolicyId] = useState<Uint8Array | null>();
  const [policy, setPolicy] = useState<EnactedPolicy | null>(null);

  const { getPolicyId, getPolicy } = useAbioticAlice();

  const getUsersPolicyId = async () => {
    const policyId = await getPolicyId(label, nuUser!);
    console.log(
      "User Verifying key",
      utils.hexlify(nuUser!.verifyingKey.toBytes())
    );
    setPolicyId(policyId);
  };

  useEffect(() => {
    if (label && nuUser) {
      console.log("Current label", label);
      getUsersPolicyId();
    }
  }, [label, nuUser]);

  // Listen for policy to be enacted

  const handlePolicyGranted: TypedListener<PolicyFulfilledEvent> = async (
    policyId
  ) => {
    const policy = await getPolicy(policyId);
    setPolicy(policy);
    setLoading(false);
    setDone(true)
  };

  useEffect(() => {
    if (openDRM721) {
      // TODO: Figure out policyId issue
      const policyIdFilter = openDRM721.filters
        .PolicyFulfilled
        // utils.hexlify(policyId)
        ();
      openDRM721.on(policyIdFilter, handlePolicyGranted);
      return () => {
        openDRM721.off(policyIdFilter, handlePolicyGranted);
      };
    }
  }, [openDRM721]);

  return { done, loading, policy };
}
