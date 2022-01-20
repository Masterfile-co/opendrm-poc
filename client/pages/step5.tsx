import HorizontalSteps from "components/layout/HorizontalSteps";
import { useStep5 } from "hooks/pages/useStep5";
import Transfer from "components/step5/Transfer";
import Decrypt from "components/step5/Decrypt";
import DescriptionBox from "components/layout/DescriptionBox";
import { NextLayoutComponentType } from "next";
import React from "react";
import Policy from "components/step5/Policy";

const Step5: NextLayoutComponentType = () => {
  const { transferProps, decryptProps, active, localSteps, image } = useStep5();

  return (
    <div className="flex flex-col min-h-screen items-center w-full h-full">
      <HorizontalSteps steps={localSteps} />
      <div className="flex flex-grow h-full w-full justify-center items-center">
        {localSteps[0].active && (
          <Transfer {...transferProps} active={active} />
        )}
        {localSteps[1].active && <Policy />}
        {(localSteps[2].active || localSteps[2].done) && (
          <Decrypt {...decryptProps} image={image} />
        )}
      </div>
      <DescriptionBox
        description={
          <>
            <span>
              In the final step of the demo we will be simulating transfering or
              selling your NFT to our friend Bob. This works like any other NFT
              transfer you may have done before (ERC-721/1155 backwards
              compatable). Immediately upon transferring, you will lose the
              ability to decrypt the NFT metadata. Once a policy has been
              created on behalf of Bob (again triggered by the transfer of the
              NFT), he will now be the only one able to decrypt the NFT
              metadata. {" "}
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
export default Step5;
