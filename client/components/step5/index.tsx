import HorizontalSteps from "components/layout/HorizontalSteps";
import DescriptionBox from "components/layout/DescriptionBox";

import Transfer from "./Transfer";
import Policy from "./Policy";
import Decrypt from "./Decrypt";

import { useStep5 } from "hooks/useStep5";
import React from "react";

export default function Step5Page() {
  const {
    steps,
    transferToken,
    active,
    loading,
    decryptAsBob,
    metadata,
    bobCleartext,
  } = useStep5();
  return (
    <div className="flex flex-col min-h-screen items-center w-full h-full px-5 pb-5">
      <HorizontalSteps steps={steps} />
      <div className="flex flex-grow h-full w-full justify-center items-center">
        {steps[0].active && (
          <Transfer
            transferToken={transferToken}
            active={active}
            loading={loading}
          />
        )}
        {/* {steps[0].active && <Policy />} */}
        {(steps[1].active || steps[1].done) && (
          <Decrypt
            loading={loading}
            metadata={metadata}
            bobCleartext={bobCleartext}
            decryptAsBob={decryptAsBob}
          />
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
              metadata.{" "}
            </span>
            <span className="text-[#Cf54AB]">
              Policy revoking is not yet implemented in the newest Nucypher
              release. To compensate for this, all policies only last 24 hours.
              After this, the previous owner will lose access. Once policy
              revoking is reintroduced, the previous owner will lose access
              immediately.
            </span>
          </>
        }
      />
    </div>
  );
}
