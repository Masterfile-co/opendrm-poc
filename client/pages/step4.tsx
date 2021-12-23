import { PrimaryButton } from "components/Button";
import { hexlify } from "ethers/lib/utils";
import { useStep4 } from "hooks/pages/useStep4";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { NextLayoutComponentType } from "next";
import React from "react";

const Step4: NextLayoutComponentType = () => {
  const { image, decrypt } = useStep4();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full space-y-10">
      <span className="text-3xl text-center font-semibold">
        Decrypt your NFT
      </span>
      <div className="bg-[#313133] w-full max-w-[360px] overflow-hidden min-h-[190px] rounded-sm text-white text-xs p-4 flex justify-center items-center">
        <span className="text-white text-sm font-bold font-secondary whitespace-pre-wrap break-all">
          {image}
        </span>
        {/* <pre className="h-full whitespace-pre-wrap break-all overflow-ellipsis text-white leading-4 text-[12px]">
          {metadata &&
            JSON.stringify(
              {
                title: metadata.title,
                description: metadata.description,
                image: hexlify(metadata.msgKit.ciphertext),
                capsule: hexlify(metadata.msgKit.capsule.toBytes()),
              },
              null,
              "\t"
            )}
        </pre> */}
      </div>
      <PrimaryButton
        className="w-[215px]"
        // disabled={!secretKey || done}
        onClick={() => {
          decrypt();
        }}
      >
        Decrypt
      </PrimaryButton>
    </div>
  );
};

export default Step4;
