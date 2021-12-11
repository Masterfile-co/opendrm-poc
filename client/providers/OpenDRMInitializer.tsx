import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { AbioticAliceContext } from "hooks/nucypher/useAbioticAlice";
import { useEagerConnect } from "hooks/connect/useEagerConnect";
import { Alice } from "nucypher-ts";
import React, { useEffect, useState } from "react";
import { ConnectorNames, connectorsByName } from "utils/connectors";
import { NuConfig } from "utils/constants";

export default function OpenDRMInitializer({ children }: { children: any }) {
  useEagerConnect();
  const { library, activate } = useWeb3React<Web3Provider>("AbioticAlice");

  const [abioticAlice, dispatchAbioticAlice] = useState<Alice | undefined>(
    undefined
  );

  const getNetwork = async () => {
    console.log(await library?.getNetwork());
  };

  useEffect(() => {
    if (library) {
      getNetwork();
      setAbioticAlice(library);
    }
  }, [library]);

  useEffect(() => {
    activate(connectorsByName[ConnectorNames.Network]);
  }, []);

  const setAbioticAlice = (provider: Web3Provider) => {
    const secretKey = Buffer.from("fake-secret-key-32-bytes-alice-x");
    const alice = Alice.fromSecretKeyBytes(NuConfig, secretKey, provider);
    dispatchAbioticAlice(alice);
  };

  return (
    <AbioticAliceContext.Provider value={{ abioticAlice, setAbioticAlice }}>
      {children}
    </AbioticAliceContext.Provider>
  );
}
