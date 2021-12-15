import { Metadata } from "hooks/components/useMetadata";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useState } from "react";
import { utils } from "ethers";
import { OPENDRM721_ADDRESS } from "utils/constants";
import { useEnrico } from "hooks/nucypher/useEnrico";

const { hexlify } = utils;

interface Step3 {
  metadata: Metadata;
  setMetadata: (metadata: Metadata) => void;
}

export function useStep3(props: Step3) {
  const { metadata, setMetadata } = props;
  const [done, setDone] = useState(false);
  const { getEncryptingKey } = useAbioticAlice();

  const encryptMetadata = async (tokenId: number, cleartext: string) => {
    // generate label
    const label = OPENDRM721_ADDRESS + "31337" + tokenId.toString();
    const encryptingKey = await getEncryptingKey(label);
    const { encryptMessage } = useEnrico({ encryptingKey });

    const messageKit = encryptMessage(cleartext);

    setMetadata({
      ...metadata,
      encryptingKey: hexlify(messageKit.capsule.toBytes()),
      image: hexlify(messageKit.ciphertext),
    });

    setDone(true);
  };

  return { done, encryptMetadata };
}
