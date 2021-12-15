import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { AbioticAliceContext } from "hooks/nucypher/useAbioticAlice";
import { useEagerConnect } from "hooks/connect/useEagerConnect";
import { Alice } from "nucypher-ts";
import React, { useEffect, useState } from "react";
import { ConnectorNames, connectorsByName } from "utils/connectors";

export default function NetworkInitalizer({ children }: { children: any }) {
  useEagerConnect();
  const { activate } = useWeb3React<Web3Provider>("Network");

  useEffect(() => {
    activate(connectorsByName[ConnectorNames.Network]);
  }, []);

  return children;
}
