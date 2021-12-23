import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { useRouter } from "next/router";
import { ConnectorNames, connectorsByName } from "utils/connectors";

export function useStep1() {
  const { activate } = useWeb3React<Web3Provider>();
  const { setStepDone, steps } = useOpenDRM();
  const { push } = useRouter();

  const requestConnection = async (name: ConnectorNames) => {
    activate(connectorsByName[name]).then((res) => {
      setStepDone(0);
      push("/step2");
    });
  };

  return { requestConnection, done: steps[0].done };
}
