import { useState } from "react";
import { OpenDRM721 } from "types";

interface Step5 {
  account: string | null | undefined;
  tokenId: number;
  openDRM721: OpenDRM721 | null;
}

export function useStep5(props: Step5) {
  const { tokenId, openDRM721, account } = props;
  const [done, setDone] = useState(false);

  const transferToBob = async () => {
    if (!openDRM721 || !account) {
      alert("Not connected!");
      return;
    }

    await openDRM721["safeTransferFrom(address,address,uint256)"](
      account,
      "0xF33F339F4B4E3B59B0716809D7A16Dd32870980F",
      tokenId,
      { gasLimit: 700_000 }
    );

    setDone(true);
  };

  return { done, transferToBob };
}
