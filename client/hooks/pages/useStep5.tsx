import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { hexlify } from "ethers/lib/utils";
import { useDecrypt } from "hooks/components/useDecrypt";
import { usePolicy } from "hooks/components/usePolicy";
import { useTransfer } from "hooks/components/useTransfer";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { Bob } from "nucypher-ts";
import { useEffect, useState } from "react";
import { NuConfig } from "utils/constants";

export function useStep5() {
  const {
    steps,
    tokenId,
    nuUserPolicyId,
    label,
    metadata,
    nuUser,
    setMinorStepDone,
    setStepDone,
  } = useOpenDRM();
  const { getPolicyId } = useAbioticAlice();
  const { library, account } = useWeb3React<Web3Provider>();
  const [image, setImage] = useState("");
  const [bobPolicyId, dispatchBobPolicyId] = useState<string | undefined>();

  useEffect(() => {
    if (metadata) {
      setImage(hexlify(metadata.msgKit.ciphertext));
    }
  }, [metadata]);

  const bob = Bob.fromSecretKey(
    NuConfig,
    Buffer.from("fake-secret-key-32-bytes-bob-xxx")
  );

  useEffect(() => {
    if (label) {
      setBobPolicyId();
    }
  }, [bob, label]);

  const setBobPolicyId = async () => {
    const policyId = await getPolicyId(label!, bob);
    dispatchBobPolicyId(policyId);
  };

  const setLocalStepDone = (stepIndex: number) => {
    setMinorStepDone(4, stepIndex);
  };

  const onPolicyCreated = () => {
    setLocalStepDone(1);
  };

  const transferProps = useTransfer({
    setLocalStepDone,
    library,
    account,
    tokenId,
  });

  const decryptProps = useDecrypt({
    nuUser,
    nuUserPolicyId,
    bob,
    bobPolicyId,
    metadata,
    setLocalStepDone,
    setStepDone,
  });

  usePolicy({ policyId: bobPolicyId, onPolicyCreated });

  return {
    transferProps,
    decryptProps,
    active: steps[4].active,
    localSteps: steps[4].minorSteps!,
    image,
  };
}
