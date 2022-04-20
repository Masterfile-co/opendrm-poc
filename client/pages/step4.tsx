import { PrimaryButton } from "components/Button";
import DecryptBox from "components/DecryptBox";
import { useStep4 } from "hooks/pages/useStep4";
import DescriptionBox from "components/layout/DescriptionBox";
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
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full px-5 pb-5">
      <div className="flex flex-col h-full justify-center items-center space-y-10">
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
      <DescriptionBox
        description={
          "After a policy has been created for the current owner of the NFT (you), you can now gather the neccessary decrypting material from the PRE Ursula network. Once a threshold of reencryption capsule fragements (cFrags) has been collected, you can then locally decrypt the NFT metadata."
        }
      />
    </div>
  );
};

Step4.getInitialProps = () => {
  return {};
};

export default Step4;
