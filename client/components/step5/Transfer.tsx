import { PrimaryButton } from "components/Button";
import Spinner from "components/Spinner";
import React from "react";

export interface Transfer {
  transferToken: () => Promise<void>;
  loading: boolean;
  active: boolean;
}

export default function Transfer(props: Transfer) {
  const { transferToken, loading, active } = props;
  return (
    <div className="flex flex-col justify-center items-center space-y-10">
      {!loading && (
        <>
          <span className="text-3xl text-center font-semibold">
            Transfer your NFT to Bob
          </span>
          <PrimaryButton
            className="w-[215px]"
            onClick={() => {
              transferToken();
            }}
            disabled={!active}
          >
            Transfer
          </PrimaryButton>
        </>
      )}
      {loading && (
        <>
          <span className="text-3xl text-center font-semibold max-w-[450px]">
            Transfer in progress
          </span>
          <div className="h-[50px] w-[50px]">
            <Spinner />
          </div>
        </>
      )}
    </div>
  );
}
