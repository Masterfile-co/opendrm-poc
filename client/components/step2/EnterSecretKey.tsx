import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import React from "react";

export default function EnterSecretKey() {
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
          value=""
          onChange={() => {}}
          //   value={secretKey}
          //   onChange={setSecretKey}
        />
        <p className="mt-2 text-sm text-[#CF5163] font-secondary">
          This password is not stored securely. Do not use a real password.
        </p>
      </div>
      <PrimaryButton
        className="w-[215px]"
        // disabled={!secretKey || done}
        // onClick={() => {
        //   registerUser();
        // }}
      >
        Register
      </PrimaryButton>
    </>
  );
}
