import { JsonRpcSigner } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import {
  AbioticAliceManager,
  AbioticAliceManager__factory,
  OpenDRM721,
  OpenDRM721__factory,
} from "types";
import { useMetadata } from "./components/useMetadata";
import { useTokenId } from "./components/useTokenId";
import { useBob } from "./nucypher/useBob";
import { useStep1 } from "./steps/useStep1";
import { useStep2 } from "./steps/useStep2";
import { useStep3 } from "./steps/useStep3";
import { useStep4 } from "./steps/useStep4";
import { useStep5 } from "./steps/useStep5";

export function useDemo() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const tokenProps = useTokenId();
  const { metadata, setMetadata } = useMetadata();

  const { decryptingKey, verifyingKey } = useBob({
    secretKey: "fake-secret-key-32-bytes-bob-xxx",
  });

  const step1 = useStep1();
  const { library } = step1;

  useEffect(() => {
    if (library) {
      const signer = library.getSigner();
      setSigner(signer);
    }
  }, [library]);

  const step2 = useStep2({ signer });
  const step3 = useStep3({ metadata, setMetadata });
  const step4 = useStep4({ signer });
  const step5 = useStep5();

  return { step1, step2, step3, step4, step5, tokenProps };
}
