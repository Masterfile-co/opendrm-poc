import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useTransfer } from "hooks/components/useTransfer";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { Step } from "providers/OpenDRMContextProvider";
import { useState } from "react";

export function useStep5() {
  const { steps, tokenId } = useOpenDRM();
  const { library, account } = useWeb3React<Web3Provider>();
  const [localSteps, setLocalSteps] = useState<Step[]>([
    { label: "A", title: "Transfer", done: false, active: true },
    { label: "B", title: "Decrypt", done: false, active: false },
  ]);

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

  return { transferProps, active: steps[4].active, localSteps };
}
