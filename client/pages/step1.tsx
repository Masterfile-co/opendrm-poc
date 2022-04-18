import { PrimaryButton } from "components/Button";
import DescriptionBox from "components/layout/DescriptionBox";
import { useConnect } from "hooks/useConnect";
import { useOpenDRM } from "hooks/useOpenDRM";
import { NextLayoutComponentType } from "next";
import { useRouter } from "next/router";
import { useAppState } from "providers/OpenDRMProvider";
import React, { useEffect } from "react";
import { metamask } from "utils/connectors";
import { mumbai } from "utils/constants";

const Step1: NextLayoutComponentType = () => {
  const { steps } = useAppState();
  const { connectMetamask } = useConnect();
  const { push } = useRouter();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full space-y-10 px-5 pb-5">
      <div className="flex flex-col h-full justify-center items-center space-y-10">
        <span className="text-3xl max-w-[330px] text-center font-semibold">
          Connect your wallet to access OpenDRM
        </span>
        <div className="flex flex-col gap-y-4">
          <PrimaryButton
            onClick={() => {
              connectMetamask();
            }}
            disabled={steps[0].done}
          >
            Connect Wallet
          </PrimaryButton>
          {steps[0].done && (
            <PrimaryButton
              onClick={() => {
                push("/step2");
              }}
            >
              Next Step
            </PrimaryButton>
          )}
        </div>
      </div>
      <DescriptionBox description={"Welcome!"} />
    </div>
  );
};

Step1.getInitialProps = () => {
  return {};
};

export default Step1;
