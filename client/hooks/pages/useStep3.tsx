import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEncrypt } from "hooks/components/useEncrypt";
import { useMint } from "hooks/components/useMint";
import { usePolicy } from "hooks/components/usePolicy";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useEnrico } from "hooks/nucypher/useEnrico";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { Step } from "providers/OpenDRMContextProvider";
import { useEffect, useState } from "react";
import { OpenDRM721__factory } from "types";
import { OPENDRM721_ADDRESS } from "utils/constants";

export function useStep3() {
  const {
    steps,
    setMetadata,
    tokenId,
    setStepDone,
    nuUser,
    setNuUserPolicyId,
    nuUserPolicyId,
    setLabel,
  } = useOpenDRM();
  const { getPolicyId } = useAbioticAlice();
  const { library, chainId } = useWeb3React<Web3Provider>();
  const [localSteps, setLocalSteps] = useState<Step[]>([
    { label: "A", title: "Encrypt", done: false, active: true },
    { label: "B", title: "Mint", done: false, active: false },
    { label: "C", title: "Policy", done: false, active: false },
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

  const encryptProps = useEncrypt({
    setLocalStepDone,
    setMetadata,
    library,
    tokenId,
    chainId,
    nuUser,
    setNuUserPolicyId,
    setLabel,
  });

  const mintProps = useMint({ setLocalStepDone, library, tokenId });

  const policyProps = usePolicy({ setStepDone, policyId: nuUserPolicyId });

  return {
    localSteps,
    encryptProps,
    mintProps,
    tokenId,
    active: steps[2].active,
    done: steps[2].done,
  };
}
