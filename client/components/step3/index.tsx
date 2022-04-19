import HorizontalSteps from "components/layout/HorizontalSteps";
import { useAppState } from "providers/OpenDRMProvider";
import { useStep3State } from "providers/pages/Step3Provider";
import DescriptionBox from "components/layout/DescriptionBox";

import React, { useEffect } from "react";

import Encrypt from "./Encrypt";
import Mint from "./Mint";
import Policy from "./Policy";
import { useStep3 } from "hooks/useStep3";
import { useWeb3React } from "@web3-react/core";
import { OpenDRM721v2__factory } from "types";
import { MINT_COST, odrm721Address } from "utils/config";
import { Web3Provider } from "@ethersproject/providers";

export default function Step3Page() {
  const {
    setCleartext,
    encryptMetadata,
    mintToken,
    steps,
    cleartext,
    loading,
    tokenId,
    active,
    // listenForPolicy,
  } = useStep3();
  const { chainId } = useWeb3React();

  // useEffect(() => {
  //   if (chainId) {
  //     listenForPolicy();
  //   }
  // }, [chainId]);

  return (
    <div className="flex flex-col min-h-screen items-center w-full h-full px-5 pb-5">
      <HorizontalSteps steps={steps} />
      <span className="border-2 border-[#313133] rounded text-[#6b7280] p-3 mt-14">
        TokenID: <span className="text-[#Cf54AB]">{tokenId}</span>
      </span>
      <div className="flex flex-grow h-full w-full justify-center items-center">
        {steps[0].active && (
          <Encrypt
            setCleartext={setCleartext}
            cleartext={cleartext}
            active={active}
            encryptMetadata={encryptMetadata}
          />
        )}
        {steps[1].active && <Mint mintToken={mintToken} loading={loading} />}
        {steps[2].active && <Policy />}
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
              decrypt the metadata.
            </span>
            <span className="text-[#Cf54AB]">
              &nbsp;Minting an OpenDRM NFT has a small upfront cost that will
              cover the cost of PRE policies for all future holders.
              {/* Occationally the demo will miss the policy creation event. If this
              steps hangs for a few minutes please refresh and try again */}
            </span>
          </>
        }
      />
    </div>
  );
}
