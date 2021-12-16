import { PrimaryButton } from "components/Button";
import StepCard from "components/StepCard";
import React from "react";

interface Step5 {
  transferToBob: () => void;
}

export default function Step5(props: Step5) {
  return (
    <StepCard stepNumber={5} stepTitle="Transfer token to Bob">
      <>
        <PrimaryButton
          onClick={() => {
            props.transferToBob();
          }}
        >
          Transfer
        </PrimaryButton>
      </>
    </StepCard>
  );
}
