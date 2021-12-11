import { PrimaryButton } from "components/Button";
import StepCard from "components/StepCard";
import React from "react";

interface Step4 {
  mintEncryptedNft: (tokenId: number) => Promise<void>;
  tokenId: number;
  done: boolean;
}

export default function Step4(props: Step4) {
  const { mintEncryptedNft, tokenId, done } = props;
  return (
    <StepCard stepNumber={4} stepTitle="Mint encrypted NFT">
      <PrimaryButton
        onClick={() => {
          mintEncryptedNft(tokenId);
        }}
        disabled={done}
      >
        Mint
      </PrimaryButton>
    </StepCard>
  );
}
