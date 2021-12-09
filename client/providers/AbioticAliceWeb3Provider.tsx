import { Web3Provider } from "@ethersproject/providers";
import { createWeb3ReactRoot } from "@web3-react/core";

const AbioticAliceWeb3Provider = createWeb3ReactRoot("AbioticAlice");

const AbioticAliceWeb3ProviderSSR = ({
  children,
  getLibrary,
}: {
  children: any;
  getLibrary: (provider: any) => Web3Provider;
}) => {
  return (
    <AbioticAliceWeb3Provider getLibrary={getLibrary}>
      {children}
    </AbioticAliceWeb3Provider>
  );
};

export default AbioticAliceWeb3ProviderSSR;
