import { JsonRpcSigner } from "@ethersproject/providers";
import { useState } from "react";
import { OpenDRM721__factory } from "types";
import { OPENDRM721_ADDRESS } from "utils/constants";

interface Step4 {
  signer: JsonRpcSigner | null;
}

export function useStep4({ signer }: Step4) {
  const [done, setDone] = useState(false);

  const mintEncryptedNft = async (tokenId: number) => {
    if (!signer) {
      alert("Please connect wallet");
      return;
    }
    const openDRM = OpenDRM721__factory.connect(OPENDRM721_ADDRESS, signer);

    try {
      const tx = await openDRM.mint(tokenId);
      await tx.wait();
      setDone(true);
    } catch (e: any) {
      alert(e.data.message);
    }
  };

  return { done, mintEncryptedNft };
}
