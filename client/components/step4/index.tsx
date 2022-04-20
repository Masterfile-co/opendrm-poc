import React from "react";

import DescriptionBox from "components/layout/DescriptionBox";
import { useStep4 } from "hooks/useStep4";
import DecryptBox from "components/DecryptBox";
import { PrimaryButton } from "components/Button";
import { hexlify } from "ethers/lib/utils";

export default function Step4Page() {
  const { cleartext, decrypt, nextPage, active, policy, metadata, loading } =
    useStep4();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full px-5 pb-5">
      <div className="flex flex-col h-full justify-center items-center space-y-10">
        <span className="text-3xl text-center max-w-[330px] font-semibold">
          {cleartext
            ? "You have successfully decrypted your NFT"
            : "Decrypt your NFT"}
        </span>
        <DecryptBox>
          {cleartext ? cleartext : hexlify(metadata?.msgKit.toBytes() || "0x")}
        </DecryptBox>
        {!cleartext && (
          <PrimaryButton
            className="w-[215px]"
            disabled={!metadata || !policy || !active || loading}
            onClick={() => {
              decrypt();
            }}
          >
            {loading ? "loading" : "Decrypt"}
          </PrimaryButton>
        )}
        {cleartext && (
          <PrimaryButton
            className="w-[215px]"
            // disabled={!secretKey || done}
            onClick={() => {
              nextPage();
            }}
          >
            Next
          </PrimaryButton>
        )}
      </div>
      <DescriptionBox
        description={
          "After a policy has been created for the current owner of the NFT (you), you can now gather the necessary decrypting material from the PRE Ursula network. Once a threshold of reencryption capsule fragments (cFrags) has been collected, you can then locally decrypt the NFT metadata."
        }
      />
    </div>
  );
}
