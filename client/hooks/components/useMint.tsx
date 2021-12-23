import { Web3Provider } from "@ethersproject/providers";
import { useState } from "react";
import { OpenDRM721__factory } from "types";
import { OPENDRM721_ADDRESS } from "utils/constants";

export interface MintHook {
  setLocalStepDone: (stepIndex: number) => void;
  library: Web3Provider | undefined;
  tokenId: number;
}

export function useMint(props: MintHook) {
  const { setLocalStepDone, library, tokenId } = props;
  const [loading, setLoading] = useState(false);

  const mintToken = async () => {
    if (!library) {
      alert("Please connect wallet");
      return;
    }

    setLoading(true);

    const openDRm721 = OpenDRM721__factory.connect(
      OPENDRM721_ADDRESS,
      library.getSigner()
    );

    // TODO: Error handling
    const tx = await openDRm721.mint(tokenId);
    await tx.wait();

    setLoading(false);
    setLocalStepDone(1);
  };

  return { mintToken, loading };
}
