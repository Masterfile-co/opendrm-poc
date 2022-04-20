import { useWeb3React } from "@web3-react/core";
import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import { useOpenDRM } from "hooks/useOpenDRM";
import React, { useState } from "react";

export interface EnterSecretKeyProps {
  done: boolean;
  register: (secret: string) => void;
}

export default function EnterSecretKey({
  register,
  done,
}: EnterSecretKeyProps) {
  const [tempSecret, setTempSecret] = useState("");

  return (
    <>
      <span className="text-3xl text-center font-semibold">
        Register your NuCypher wallet
      </span>
      <div className="min-w-[434px]">
        <TextInputField
          id="nu-pw"
          type="password"
          placeholder="Enter a password"
          value={tempSecret}
          onChange={setTempSecret}
        />
        <p className="mt-2 text-sm text-[#CF5163] font-secondary">
          This password is not stored securely. Do not use a real password.
        </p>
      </div>
      <PrimaryButton
        className="w-[215px]"
        disabled={done || !tempSecret}
        onClick={() => {
          register(tempSecret);
        }}
      >
        Register
      </PrimaryButton>
    </>
  );
}
