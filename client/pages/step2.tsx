import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import DescriptionBox from "components/layout/DescriptionBox";

import { NextLayoutComponentType } from "next";
import React from "react";


const Step2: NextLayoutComponentType = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full px-5 pb-5">
      <span className="border-2 border-[#313133] rounded text-[#6b7280] p-3 mt-12">
        Get{" "}
        <a
          className="text-[#Cf54AB]"
          href="https://faucet.polygon.technology/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testnet Eth
        </a>
      </span>
      <div className="flex flex-col h-full justify-center items-center w-full space-y-10"></div>
      <DescriptionBox
        description={
          "To begin using the OpenDRM protocol, you must first create a NuCypher wallet derived from a password. You must then create an onchain mapping from your Ethereum address to your NuCypher public keys. In the future we hope to remove this step and derive all NuCypher keys directly from your Eth wallet."
        }
      />
    </div>
  );
};

Step2.getInitialProps = () => {
  return {};
};

export default Step2;
