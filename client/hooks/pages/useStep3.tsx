import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEncrypt } from "hooks/components/useEncrypt";
import { useMint } from "hooks/components/useMint";
import { usePolicy } from "hooks/components/usePolicy";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { useRouter } from "next/router";

export function useStep3() {
  const {
    steps,
    setMetadata,
    tokenId,
    setStepDone,
    setMinorStepDone,
    nuUser,
    setNuUserPolicyId,
    nuUserPolicyId,
    setLabel,
  } = useOpenDRM();
  const { push } = useRouter();
  const { library, chainId } = useWeb3React<Web3Provider>();

  const setLocalStepDone = (stepIndex: number) => {
    setMinorStepDone(2, stepIndex);
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

  const onPolicyCreated = () => {
    setStepDone(2);
    push("/step4");
  };

  usePolicy({ onPolicyCreated, policyId: nuUserPolicyId });

  return {
    localSteps: steps[2].minorSteps!,
    encryptProps,
    mintProps,
    tokenId,
    active: steps[2].active,
    done: steps[2].done,
  };
}
