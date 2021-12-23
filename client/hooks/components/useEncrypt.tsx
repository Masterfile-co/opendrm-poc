import { Web3Provider } from "@ethersproject/providers";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useEnrico } from "hooks/nucypher/useEnrico";
import { MessageKit } from "nucypher-ts";
import { Metadata } from "providers/OpenDRMContextProvider";
import { useState } from "react";
import { OPENDRM721_ADDRESS } from "utils/constants";

export interface EncryptHook {
  library: Web3Provider | undefined;
  chainId: number | undefined;
  tokenId: number;
  setLocalStepDone: (stepIndex: number) => void;
  setMetadata: (metadata: Metadata) => void;
}

export function useEncrypt(props: EncryptHook) {
  const { library, chainId, tokenId, setLocalStepDone, setMetadata } = props;
  const [cleartext, dispatchCleartext] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { getEncryptingKey } = useAbioticAlice();

  const setCleartext = (cleartext: string) => {
    dispatchCleartext(cleartext);
  };

  const encryptMetadata = async () => {
    if (!cleartext) {
      alert("Please enter NFT data");
      return;
    }
    if (!library || !chainId) {
      alert("Please connect wallet");
      return;
    }
    const label = OPENDRM721_ADDRESS + chainId.toString() + tokenId.toString();
    const encryptingKey = await getEncryptingKey(label);
    const { encryptMessage } = useEnrico({ encryptingKey });
    const messageKit = encryptMessage(cleartext);

    setMetadata({
      title: "OpenDRM Demo",
      description: "",
      msgKit: messageKit,
    });

    setLocalStepDone(0);
  };

  return { loading, cleartext, setCleartext, encryptMetadata };
}
