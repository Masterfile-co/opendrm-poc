import { Web3Provider } from "@ethersproject/providers";
import { createWeb3ReactRoot } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);

  return library;
};

export const RPC_URLS: { [chainId: number]: string } = {
  5: "https://goerli.infura.io/v3/81a603725ab7497496a9fbcdea621dc1",
  1337: "http://0.0.0.0:8545/",
  31337: "http://0.0.0.0:8545/",
};

export const network = new NetworkConnector({
  urls: { 5: RPC_URLS[5], 1337: RPC_URLS[1337], 31337: RPC_URLS[31337] },
  defaultChainId: 5,
});

export const injected = new InjectedConnector({
  supportedChainIds: [5, 1337, 31337],
});

export enum ConnectorNames {
  Injected = "Injected",
  Network = "Network",
  // WalletConnect = "WalletConnect",
  // WalletLink = "WalletLink",
  // Ledger = "Ledger",
  //   Trezor = "Trezor",
  //   Lattice = "Lattice",
  //   Frame = "Frame",
  //   Authereum = "Authereum",
  //   Fortmatic = "Fortmatic",
  //   Magic = "Magic",
  //   Portis = "Portis",
  //   Torus = "Torus",
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,

  //   [ConnectorNames.WalletConnect]: walletconnect,
  //   [ConnectorNames.WalletLink]: walletlink,
  //   [ConnectorNames.Ledger]: ledger,
};
