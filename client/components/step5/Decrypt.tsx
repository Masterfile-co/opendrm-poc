import { PrimaryButton } from "components/Button";
import DecryptBox from "components/DecryptBox";
import { hexlify } from "ethers/lib/utils";
import React from "react";
import { Metadata } from "utils/types";

export interface Decrypt {
  metadata: Metadata | undefined;
  bobCleartext: string | undefined;
  decryptAsBob: () => Promise<void>;
  loading: boolean;
  // decryptAsYou: () => Promise<void>
}

export default function Decrypt(props: Decrypt) {
  const { metadata, bobCleartext, decryptAsBob, loading } = props;
  return (
    <div className="flex w-full justify-center space-x-10">
      <div className="flex flex-col items-center space-y-5">
        <span className="text-3xl text-center max-w-[330px] font-semibold">
          Decrypt as you
        </span>
        <DecryptBox>{hexlify(metadata?.msgKit.toBytes() || "0x")}</DecryptBox>
        <PrimaryButton
          className="w-[215px]"
          disabled
          // onClick={() => {
          //   decryptAsYou();
          // }}
        >
          Decrypt
        </PrimaryButton>
      </div>
      <div className="flex flex-col items-center space-y-5">
        <span className="text-3xl text-center max-w-[330px] font-semibold">
          Decrypt as Bob
        </span>
        <DecryptBox>
          {bobCleartext
            ? bobCleartext
            : hexlify(metadata?.msgKit.toBytes() || "0x")}
        </DecryptBox>
        <PrimaryButton
          className="w-[215px]"
          disabled={loading}
          onClick={() => {
            decryptAsBob();
          }}
        >
          {loading ? "loading" : "Decrypt"}
        </PrimaryButton>
      </div>
    </div>
  );
}
