import { Metadata } from "hooks/components/useMetadata";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useState } from "react";
import { utils } from "ethers";
import { OPENDRM721_ADDRESS } from "utils/constants";
import { useEnrico } from "hooks/nucypher/useEnrico";
import { JsonRpcSigner } from "@ethersproject/providers";
import { OpenDRM721, OpenDRM721__factory } from "types";

const { hexlify } = utils;

interface Step3 {
  tokenId: number;
  label: string;
  openDRM721: OpenDRM721 | null;
  metadata: Metadata;
  setMetadata: (metadata: Metadata) => void;
}

export function useStep3(props: Step3) {
  const { metadata, setMetadata, openDRM721, label, tokenId } = props;
  const [done, setDone] = useState(false);
  const { getEncryptingKey } = useAbioticAlice();

  const encryptMetadata = async (cleartext: string) => {
    // generate label
    const encryptingKey = await getEncryptingKey(label);
    const { encryptMessage } = useEnrico({ encryptingKey });
    const messageKit = encryptMessage(cleartext);

    setMetadata({
      ...metadata,
      encryptingKey: hexlify(messageKit.capsule.toBytes()),
      image: hexlify(messageKit.ciphertext),
    });
  };

  const mintEncryptedNft = async () => {
    if (!openDRM721) {
      alert("Please connect wallet");
      return;
    }

    try {
      const tx = await openDRM721.mint(tokenId);
      await tx.wait();
      setDone(true);
    } catch (e: any) {
      alert(e.data.message);
    }
  };

  const encryptAndMint = async (cleartext: string) => {
    await encryptMetadata(cleartext)
    await mintEncryptedNft()
  };

  return { done, encryptAndMint };
}
