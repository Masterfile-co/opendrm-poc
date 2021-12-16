import { useState } from "react";

export function useTokenId() {
  const [tokenId, dispatchTokenId] = useState(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

  const setTokenId = (tokenId: number) => {
    dispatchTokenId(tokenId);
  };

  return {
    tokenId,
    setTokenId,
  };
}
