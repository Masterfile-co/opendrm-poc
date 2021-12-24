import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { hexlify } from "ethers/lib/utils";
import { useDecrypt } from "hooks/components/useDecrypt";
import { useTransfer } from "hooks/components/useTransfer";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { Step } from "providers/OpenDRMContextProvider";
import { useEffect, useState } from "react";

export function useStep5() {
  const {
    steps,
    tokenId,
    nuUserPolicyId,
    label,
    metadata,
    nuUser,
  } = useOpenDRM();
  const { library, account } = useWeb3React<Web3Provider>();
  const [localSteps, setLocalSteps] = useState<Step[]>([
    { label: "A", title: "Transfer", done: false, active: true },
    { label: "B", title: "Decrypt", done: false, active: false },
  ]);

  const [image, setImage] = useState("");
  useEffect(() => {
    if (metadata) {
      setImage(hexlify(metadata.msgKit.ciphertext));
    }
  }, [metadata]);

  const setLocalStepDone = (stepIndex: number) => {
    const steps_ = [...localSteps];
    for (var i = 0; i <= stepIndex; i++) {
      steps_[i].done = true;
      steps_[i].active = false;
    }
    steps_[stepIndex + 1].active = true;
    setLocalSteps(steps_);
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
    label,
    metadata,
  });

  return {
    transferProps,
    decryptProps,
    active: steps[4].active,
    localSteps,
    image,
  };
}
