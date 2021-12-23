import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import React from "react";

export interface Encrypt {
  cleartext: string | undefined;
  setCleartext: (cleartext: string) => void;
  encryptMetadata: () => void;
  active: boolean;
}

export default function Encrypt(props: Encrypt) {
  const { cleartext, setCleartext, active, encryptMetadata } = props;
  return (
    <div className="flex flex-col flex-grow  h-full justify-center items-center">
      <span className="text-3xl text-center font-semibold">
        Encrypt your NFT
      </span>
      <div className="min-w-[434px] mt-6 mb-6">
        <TextInputField
          id="nu-pw"
          type="text"
          placeholder="Enter your NFT data"
          value={cleartext}
          onChange={setCleartext}
        />
      </div>
      <PrimaryButton
        className="w-[215px]"
        onClick={() => {
          encryptMetadata();
        }}
        disabled={!active || !cleartext}
      >
        Encrypt
      </PrimaryButton>
    </div>
  );
}
