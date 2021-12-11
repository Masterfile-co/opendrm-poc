import { useState } from "react";

export function useTokenId() {
  const [tokenId, dispatchTokenId] = useState(0);

  const setTokenId = (tokenId: number) => {
    dispatchTokenId(tokenId);
  };

  return {
    tokenId,
    setTokenId,
  };
}
