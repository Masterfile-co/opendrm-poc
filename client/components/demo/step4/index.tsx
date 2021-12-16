import { PrimaryButton } from "components/Button";
import StepCard from "components/StepCard";
import { EnactedPolicy } from "nucypher-ts";
import React from "react";

interface Step4 {
  loading: boolean;
  done: boolean;
  policy: EnactedPolicy | null;
}

export default function Step4(props: Step4) {
  const { loading, done, policy } = props;
  return (
    <StepCard stepNumber={4} stepTitle="Decrypt your encrypted NFT">
      <>
        {loading && <span>Please wait. Policy being created...</span>}
        {policy && (
          <>
            <span>{JSON.stringify(policy, null, 4)}</span>
            <PrimaryButton
            // onClick={() => {
            //   mintEncryptedNft(tokenId);
            // }}
            disabled={done}
            >
              Mint
            </PrimaryButton>
          </>
        )}
      </>
    </StepCard>
  );
}
