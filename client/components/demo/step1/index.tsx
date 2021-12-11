import { PrimaryButton } from "components/Button";
import StepCard from "components/StepCard";
import { useConnect } from "hooks/connect/useConnect";
import React from "react";
import { ConnectorNames } from "utils/connectors";

interface IStep1 {
  requestConnection: (name: ConnectorNames) => Promise<void>;
  error: Error | undefined;
  active: boolean;
}

export default function Step1(props: IStep1) {
  const { requestConnection, error, active } = props;
  return (
    <StepCard stepNumber={1} stepTitle="Connect your wallet">
      <>
        {error && <span className="flex bg-red-500">{error.message}</span>}
        <PrimaryButton
          onClick={() => {
            requestConnection(ConnectorNames.Injected);
          }}
          disabled={active}
        >
          Connect Wallet
        </PrimaryButton>
      </>
    </StepCard>
  );
}
