import { PrimaryButton } from "components/Button";
import { useStep1 } from "hooks/pages/useStep1";
import { NextLayoutComponentType } from "next";
import React from "react";
import { ConnectorNames, injected } from "utils/connectors";

const Step1: NextLayoutComponentType = () => {
  const { requestConnection, done } = useStep1();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full space-y-10">
      <span className="text-3xl max-w-[330px] text-center font-semibold">
        Connect your wallet to access OpenDRM
      </span>
      <PrimaryButton
        onClick={() => {
          requestConnection(ConnectorNames.Injected);
        }}
        disabled={done}
      >
        Connect Wallet
      </PrimaryButton>
    </div>
  );
};

export default Step1;
