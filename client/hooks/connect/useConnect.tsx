import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ConnectorNames, connectorsByName } from "utils/connectors";
import { useEffect } from "react";

export function useConnect() {
  const { activate, error, library, account, active } = useWeb3React<Web3Provider>();

  const requestConnection = async (name: ConnectorNames) => {
    await activate(connectorsByName[name]);
    localStorage.setItem("connector", name.toString());
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  return {
    account,
    active,
    requestConnection,
    library,
    error,
  };
}
