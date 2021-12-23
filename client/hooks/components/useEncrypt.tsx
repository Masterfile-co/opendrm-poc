import { Web3Provider } from "@ethersproject/providers";
import { hexlify } from "ethers/lib/utils";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useEnrico } from "hooks/nucypher/useEnrico";
import { Bob, MessageKit } from "nucypher-ts";
import { Metadata } from "providers/OpenDRMContextProvider";
import { useState } from "react";
import { OPENDRM721_ADDRESS } from "utils/constants";

export interface EncryptHook {
  library: Web3Provider | undefined;
  chainId: number | undefined;
  tokenId: number;
  setLocalStepDone: (stepIndex: number) => void;
  setMetadata: (metadata: Metadata) => void;
  setNuUserPolicyId: (policyId: string) => void;
  nuUser: Bob | undefined;
}

export function useEncrypt(props: EncryptHook) {
  const {
    library,
    chainId,
    tokenId,
    setLocalStepDone,
    setMetadata,
    setNuUserPolicyId,
    nuUser,
  } = props;
  const [cleartext, dispatchCleartext] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { getEncryptingKey, getPolicyId } = useAbioticAlice();

  const setCleartext = (cleartext: string) => {
    dispatchCleartext(cleartext);
  };

  const encryptMetadata = async () => {
    if (!cleartext) {
      alert("Please enter NFT data");
      return;
    }
    if (!library || !chainId || !nuUser) {
      alert("Please connect wallet");
      return;
    }
    const label = OPENDRM721_ADDRESS.toLowerCase() + chainId.toString() + tokenId.toString();
    const encryptingKey = await getEncryptingKey(label);
    const { encryptMessage } = useEnrico({ encryptingKey });
    const messageKit = encryptMessage(cleartext);

    setMetadata({
      title: "OpenDRM Demo",
      description: "An OpenDRM prototype demonstration",
      msgKit: messageKit,
    });
    
    const policyId = await getPolicyId(label, nuUser);

    console.log(policyId);

    setNuUserPolicyId(policyId);

    setLocalStepDone(0);
  };

  return { loading, cleartext, setCleartext, encryptMetadata };
}
