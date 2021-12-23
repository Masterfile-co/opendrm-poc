import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import { useStep2 } from "hooks/pages/useStep2";
import { NextLayoutComponentType } from "next";
import React from "react";

const Step2: NextLayoutComponentType = () => {
  const { secretKey, setSecretKey, registerUser, done, active } = useStep2();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full space-y-10">
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
          This password is not stored securely. Do not use a real password.
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
    </div>
  );
};

export default Step2;
