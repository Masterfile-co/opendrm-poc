import { PrimaryButton } from "components/Button";
import DecryptBox from "components/DecryptBox";
import React from "react";

export interface Decrypt {
  image: string;
  bobCleartext: string | undefined;
  decryptAsBob: () => Promise<void>;
  decryptAsYou: () => Promise<void>
}

export default function Decrypt(props: Decrypt) {
  const { image, bobCleartext, decryptAsBob, decryptAsYou } = props;
  return (
    <div className="flex w-full justify-center space-x-10">
      <div className="flex flex-col items-center space-y-5">
        <span className="text-3xl text-center max-w-[330px] font-semibold">
          Decrypt as you
        </span>
        <DecryptBox>{image}</DecryptBox>
        <PrimaryButton
          className="w-[215px]"
            onClick={() => {
              decryptAsYou();
            }}
        >
          Decrypt
        </PrimaryButton>
      </div>
      <div className="flex flex-col items-center space-y-5">
        <span className="text-3xl text-center max-w-[330px] font-semibold">
          Decrypt as Bob
        </span>
        <DecryptBox>{bobCleartext ? bobCleartext : image}</DecryptBox>
        <PrimaryButton
          className="w-[215px]"
          // disabled={!secretKey || done}
          onClick={() => {
            decryptAsBob();
          }}
        >
          Decrypt
        </PrimaryButton>
      </div>
    </div>
  );
}
