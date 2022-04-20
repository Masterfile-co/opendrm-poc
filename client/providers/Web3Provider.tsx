import React, { useEffect } from "react";

import {
  initializeConnector,
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { metamask, metamaskHooks } from "utils/connectors";


const connectors: [MetaMask, Web3ReactHooks][] = [[metamask, metamaskHooks]];

export default function Web3Provider({ children }: { children: any }) {
  useEffect(() => {
    metamask.connectEagerly();
  }, []);

  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  );
}
