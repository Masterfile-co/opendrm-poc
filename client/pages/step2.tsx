import { PrimaryButton } from "components/Button";
import TextInputField from "components/TextInputField";
import DescriptionBox from "components/layout/DescriptionBox";

import { NextLayoutComponentType } from "next";
import React, { useEffect, useState } from "react";
import { useOpenDRM } from "hooks/useOpenDRM";
import EnterSecretKey from "components/step2/EnterSecretKey";
import { useWeb3React } from "@web3-react/core";
import { Bob, defaultConfiguration } from "@nucypher/nucypher-ts";
import { ChainId } from "@nucypher/nucypher-ts/build/main/src/types";
import { bobFromSecret, toSecretKey } from "utils";
import { OpenDRMCoordinator__factory } from "types";
import { Web3Provider } from "@ethersproject/providers";
import Step2Loading from "components/step2/Step2Loading";
import { useRouter } from "next/router";
import { useAppState } from "providers/OpenDRMProvider";
import { coordinatorAddress } from "utils/config";

const Step2: NextLayoutComponentType = () => {
  const [loading, setLoading] = useState(false);
  const { steps } = useAppState();
  const { provider } = useWeb3React();
  const { setSecret } = useOpenDRM();
  const { push } = useRouter();

  const register = async (secret: string) => {
    setLoading(true);

    if (!provider) {
      alert("Please connect wallet");
      return;
    }
    if (!secret) {
      alert("Please enter secret");
      return;
    }

    const bob = bobFromSecret(secret);

    const coordinator = OpenDRMCoordinator__factory.connect(
      coordinatorAddress,
      (provider as Web3Provider).getSigner()
    );

    coordinator
      .register(bob.verifyingKey.toBytes(), bob.decryptingKey.toBytes())
      .then((tx) => tx.wait())
      .then((res) => {
        setSecret(secret);
        setLoading(false);
        push("/step3");
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full px-5 pb-5">
      <span className="border-2 border-[#313133] rounded text-[#6b7280] p-3 mt-12">
        Get{" "}
        <a
          className="text-[#Cf54AB]"
          href="https://faucet.polygon.technology/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testnet Eth
        </a>
      </span>
      <div className="flex flex-col h-full justify-center items-center w-full space-y-10">
        {!loading && (
          <EnterSecretKey register={register} done={steps[1].done} />
        )}
        {loading && <Step2Loading />}
      </div>
      <DescriptionBox
        description={
          "To begin using the OpenDRM protocol, you must first create a NuCypher wallet derived from a password. You must then create an onchain mapping from your Ethereum address to your NuCypher public keys. In the future we hope to remove this step and derive all NuCypher keys directly from your Eth wallet."
        }
      />
    </div>
  );
};

Step2.getInitialProps = () => {
  return {};
};

export default Step2;
