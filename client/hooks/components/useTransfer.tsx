import { Web3Provider } from "@ethersproject/providers";
import { useState } from "react";
import { OpenDRM721__factory } from "types";
import { OPENDRM721_ADDRESS } from "utils/constants";

export interface TransferHook {
  setLocalStepDone: (stepIndex: number) => void;
  library: Web3Provider | undefined;
  account: string | undefined | null;
  tokenId: number;
}

export function useTransfer(props: TransferHook) {
  const { tokenId, library, account, setLocalStepDone } = props;
  const [loading, setLoading] = useState(false);

  const transferToken = async () => {
    if (!library || !account) {
      alert("Please connect wallet");
      return;
    }

    setLoading(true);

    const openDRM721 = OpenDRM721__factory.connect(
      OPENDRM721_ADDRESS,
      library.getSigner()
    );

    const tx = await openDRM721.transferFrom(
      account,
      process.env.NEXT_PUBLIC_BOB_ADDRESS as string,
      tokenId
    );
    await tx.wait();

    setLoading(false);
    setLocalStepDone(0);
  };

  return {loading, transferToken}
}
