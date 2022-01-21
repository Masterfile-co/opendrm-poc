import Spinner from "components/Spinner";
import React from "react";

export default function Policy() {
  return (
    <div className="flex flex-col justify-center items-center space-y-10">
      <span className="text-3xl text-center font-semibold max-w-[450px]">
        {`Please wait while Bob's policy is being created`}
      </span>
      <div className="h-[50px] w-[50px]">
        <Spinner />
      </div>
    </div>
  );
}
