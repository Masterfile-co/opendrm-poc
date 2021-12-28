import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import DescriptionBox from "components/layout/DescriptionBox";
import { useStep2 } from "hooks/pages/useStep2";
import { NextLayoutComponentType } from "next";
import React from "react";
import Spinner from "components/Spinner";

const Step2: NextLayoutComponentType = () => {
  const { secretKey, setSecretKey, registerUser, done, loading } = useStep2();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full px-5 pb-5">
      <span className="border-2 border-[#313133] rounded text-[#6b7280] p-3 mt-12">
        Get{" "}
        <a
          className="text-[#Cf54AB]"
          href="https://faucet.paradigm.xyz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testnet Eth
        </a>
      </span>
      <div className="flex flex-col h-full justify-center items-center w-full space-y-10">
        {!loading && (
          <>
            {" "}
            <span className="text-3xl text-center font-semibold">
              Register your NuCypher wallet
            </span>
            <div className="min-w-[434px]">
              <TextInputField
                id="nu-pw"
                type="password"
                placeholder="Enter a password"
                value={secretKey}
                onChange={setSecretKey}
              />
              <p className="mt-2 text-sm text-[#CF5163] font-secondary">
                This password is not stored securely. Do not use a real
                password.
              </p>
            </div>
            <PrimaryButton
              className="w-[215px]"
              disabled={!secretKey || done}
              onClick={() => {
                registerUser();
              }}
            >
              Register
            </PrimaryButton>
          </>
        )}
        {loading && (
          <>
            <span className="text-3xl text-center font-semibold max-w-[450px]">
              Registering Wallet
            </span>
            <div className="h-[50px] w-[50px]">
              <Spinner />
            </div>
          </>
        )}
      </div>
      <DescriptionBox
        description={
          "To begin using the OpenDRM protocol, you must first create a NuCypher wallet derived from a password. You must then create an onchain mapping from your Ethereum address to your NuCypher public keys. In the future we hope to remove this step and derive all NuCypher keys directly from your Eth wallet."
        }
      />
    </div>
  );
};

export default Step2;
