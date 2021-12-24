import { PrimaryButton } from "components/Button";
import DecryptBox from "components/DecryptBox";
import { hexlify } from "ethers/lib/utils";
import { useStep4 } from "hooks/pages/useStep4";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { NextLayoutComponentType } from "next";
import React from "react";

const Step4: NextLayoutComponentType = () => {
  const {
    image,
    decrypt,
    cleartext,
    incPage,
    nuUserPolicyId,
    active,
  } = useStep4();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full space-y-10">
      <span className="text-3xl text-center max-w-[330px] font-semibold">
        {cleartext
          ? "You have successfully decrypted your NFT"
          : "Decrypt your NFT"}
      </span>
      <DecryptBox>{cleartext ? cleartext : image}</DecryptBox>
      {!cleartext && (
        <PrimaryButton
          className="w-[215px]"
          disabled={!image || !nuUserPolicyId || !active}
          onClick={() => {
            decrypt();
          }}
        >
          Decrypt
        </PrimaryButton>
      )}
      {cleartext && (
        <PrimaryButton
          className="w-[215px]"
          // disabled={!secretKey || done}
          onClick={() => {
            incPage();
          }}
        >
          Next
        </PrimaryButton>
      )}
    </div>
  );
};

export default Step4;
