import type { AddEthereumChainParameter } from "@web3-react/types";

export const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

export const OPENDRM_COORDINATOR = process.env
  .NEXT_PUBLIC_OPENDRM_COORDINATOR_ADDRESS as string;

export const OPENDRM721_ADDRESS = process.env
  .NEXT_PUBLIC_OPENDRM721_ADDRESS as string;

export const ABIOTICALICE_ADDRESS = process.env
  .NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS as string;

// Policy defaults, will make this dynamic user inputs later
export const THRESHOLD = 2;
export const SHARES = 3;
export const PAYMENT_PERIODS = 3;

export const mumbai: AddEthereumChainParameter = {
  chainId: 80001,
  chainName: "Mumbai",
  nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://rpc-mumbai.matic.today"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com"],
};
