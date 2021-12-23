import { PrimaryButton } from "components/Button";
import Spinner from "components/Spinner";
import React from "react";

export interface Mint {
  mintToken: () => Promise<void>;
  loading: boolean;
}

export default function Mint(props: Mint) {
  const { mintToken, loading } = props;
  return (
    <div className="flex flex-col justify-center items-center space-y-10">
      {!loading && (
        <>
          <span className="text-3xl text-center font-semibold">
            Encrypt your NFT
          </span>
          <PrimaryButton
            className="w-[215px]"
            onClick={() => {
              mintToken();
            }}
            // disabled={!active || !cleartext}
          >
            Mint
          </PrimaryButton>
        </>
      )}
      {loading && (
        <>
          <span className="text-3xl text-center font-semibold max-w-[450px]">
            Minting in progress
          </span>
          <div className="h-[50px] w-[50px]">
            <Spinner />
          </div>
        </>
      )}
    </div>
  );
}
