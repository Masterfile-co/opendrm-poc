import type { AddEthereumChainParameter } from "@web3-react/types";
import { ethers } from "ethers";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const {
  dkgUrl,
  coordinatorAddress,
  odrm721Address,
  bobAddress,
}: {
  dkgUrl: string;
  coordinatorAddress: string;
  odrm721Address: string;
  bobAddress: string;
} = publicRuntimeConfig;

console.log({ odrm721Address });

export { dkgUrl, coordinatorAddress, odrm721Address, bobAddress };

export const mumbai: AddEthereumChainParameter = {
  chainId: 80001,
  chainName: "Mumbai",
  nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://rpc-mumbai.matic.today"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com"],
};

export const MINT_COST = ethers.BigNumber.from(1000000000)
  .mul(3)
  .mul(86000)
  .mul(100);
