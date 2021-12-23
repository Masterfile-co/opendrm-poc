import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { ConnectorNames, connectorsByName } from "utils/connectors";

export function useNetworkConnect() {
  const { activate } = useWeb3React<Web3Provider>("Network");

  useEffect(() => {
    activate(connectorsByName[ConnectorNames.Network]);
  }, []);
  
}
