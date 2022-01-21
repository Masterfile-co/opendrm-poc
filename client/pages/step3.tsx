import { PrimaryButton } from "components/Button";
import HorizontalSteps from "components/layout/HorizontalSteps";
import Encrypt from "components/step3/Encrypt";
import Mint from "components/step3/Mint";
import Policy from "components/step3/Policy";
import DescriptionBox from "components/layout/DescriptionBox";
import { useStep3 } from "hooks/pages/useStep3";
import { NextLayoutComponentType } from "next";
import React from "react";
import getConfig from "next/config";

const Step3: NextLayoutComponentType = () => {
  const state = useStep3();
  const { localSteps, mintProps, encryptProps, active, tokenId } = state;
  return (
    <div className="flex flex-col min-h-screen items-center w-full h-full px-5 pb-5">
      <HorizontalSteps steps={localSteps} />
      <span className="border-2 border-[#313133] rounded text-[#6b7280] p-3 mt-14">
        TokenID: <span className="text-[#Cf54AB]">{tokenId}</span>
      </span>
      <div className="flex flex-grow h-full w-full justify-center items-center">
        {localSteps[0].active && <Encrypt {...encryptProps} active={active} />}
        {localSteps[1].active && <Mint {...mintProps} />}
        {localSteps[2].active && <Policy />}
      </div>
      <DescriptionBox
        description={
          <>
            <span>
              In this step you begin by encrypting your NFT metadata. Currently
              this is only text, but will support any media in the future. Your
              metadata, as it will be publicly stored, is shown in the bottom
              left corner. Next you will mint the NFT associated with this
              metadata. Minting the NFT will trigger a PRE policy to be created
              on your behalf, allowing the current NFT owner (you) to be able to
              decrypt the metadata.{" "}
            </span>
            <span className="text-[#Cf54AB]">
              Occationally the demo will miss the policy creation event. If this
              steps hangs for a few minutes please refresh and try again
            </span>
          </>
        }
      />
    </div>
  );
};

Step3.getInitialProps = () => {
  return {};
};

export default Step3;
