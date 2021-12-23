import { PrimaryButton } from "components/Button";
import HorizontalSteps from "components/layout/HorizontalSteps";
import Encrypt from "components/step3/Encrypt";
import Mint from "components/step3/Mint";
import Policy from "components/step3/Policy";
import TextInputField from "components/TextInputField";
import { useStep3 } from "hooks/pages/useStep3";
import { NextLayoutComponentType } from "next";
import React from "react";

const Step3: NextLayoutComponentType = () => {
  const state = useStep3();
  const { localSteps, mintProps, encryptProps, active, tokenId } = state;
  return (
    <div className="flex flex-col min-h-screen items-center w-full h-full">
      <HorizontalSteps steps={localSteps} />
      <span className="border-2 border-[#313133] rounded text-[#6b7280] p-3 mt-14">
        TokenID: <span className="text-[#Cf54AB]">{tokenId}</span>
      </span>
      <div className="flex flex-grow h-full w-full justify-center items-center">
        {localSteps[0].active && <Encrypt {...encryptProps} active={active} />}
        {localSteps[1].active && <Mint {...mintProps} />}
        {localSteps[2].active && <Policy />}
      </div>
    </div>
  );
};

export default Step3;
