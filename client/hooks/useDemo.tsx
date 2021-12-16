import { JsonRpcSigner } from "@ethersproject/providers";
import { Bob } from "nucypher-ts";
import { useEffect, useState } from "react";
import {
  AbioticAliceManager,
  AbioticAliceManager__factory,
  OpenDRM721,
  OpenDRM721__factory,
} from "types";
import { OPENDRM721_ADDRESS } from "utils/constants";
import { useMetadata } from "./components/useMetadata";
import { useNuUser } from "./components/useNuUser";
import { useTokenId } from "./components/useTokenId";
import { useBob } from "./nucypher/useBob";
import { useStep1 } from "./steps/useStep1";
import { useStep2 } from "./steps/useStep2";
import { useStep3 } from "./steps/useStep3";
import { useStep4 } from "./steps/useStep4";
import { useStep5 } from "./steps/useStep5";

export function useDemo() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [label, setLabel] = useState<string>("");
  const [openDRM721, setOpenDRM721] = useState<OpenDRM721 | null>(null);
  const tokenProps = useTokenId();
  const { tokenId } = tokenProps;
  const { metadata, setMetadata } = useMetadata();
  const { nuUser, setNuUser } = useNuUser();

  const { decryptingKey, verifyingKey } = useBob({
    secretKey: "fake-secret-key-32-bytes-bob-xxx",
  });

  const step1 = useStep1();
  const { library, chainId, account } = step1;

  useEffect(() => {
    if (library) {
      const signer = library.getSigner();
      setSigner(signer);
    }
  }, [library]);

  useEffect(() => {
    if (signer) {
      setOpenDRM721(OpenDRM721__factory.connect(OPENDRM721_ADDRESS, signer));
    }
  }, [signer]);

  useEffect(() => {
    setLabel(OPENDRM721_ADDRESS + chainId?.toString() + tokenId.toString());
  }, [tokenId, chainId]);

  const step2 = useStep2({ signer, setNuUser });
  const step3 = useStep3({ tokenId, label, metadata, setMetadata, openDRM721 });
  const step4 = useStep4({ label, nuUser, openDRM721 });
  const step5 = useStep5({tokenId, openDRM721, account});

  return { step1, step2, step3, step4, step5, tokenProps };
}
