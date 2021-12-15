import { Web3Provider } from "@ethersproject/providers";
import { createWeb3ReactRoot } from "@web3-react/core";

const NetworkProvider = createWeb3ReactRoot("Network");

const NetworkProviderSSR = ({
  children,
  getLibrary,
}: {
  children: any;
  getLibrary: (provider: any) => Web3Provider;
}) => {
  return <NetworkProvider getLibrary={getLibrary}>{children}</NetworkProvider>;
};

export default NetworkProviderSSR;
