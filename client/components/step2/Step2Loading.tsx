import Spinner from "components/Spinner";
import React from "react";

export default function Step2Loading() {
  return (
    <>
      <span className="text-3xl text-center font-semibold max-w-[450px]">
        Registering Wallet
      </span>
      <div className="h-[50px] w-[50px]">
        <Spinner />
      </div>
    </>
  );
}
