import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  AbioticAliceManager__factory,
  IPolicyManager__factory,
  OpenDRM721,
  OpenDRM721__factory,
} from "../types";
import { PolicyRequestedEvent } from "../types/AbioticAliceManager";
import { TypedListener } from "../types/common";
import { Alice, Bob, PublicKey, RemoteBob } from "nucypher-ts";
import { Web3Provider } from "@ethersproject/providers";

import PolicyManager from "../types/PolicyManager.json";

const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

async function main() {
  const { bob } = await getNamedAccounts();

  const OpenDRM = await deployments.get("OpenDRM721");
  const openDRM = OpenDRM721__factory.connect(
    OpenDRM.address,
    await ethers.getSigner(bob)
  );

  const tx = await openDRM.revokePolicy("0x01f8e54216b881900819c53ba7766d7f");

  await tx.wait();
}

main().catch((err) => {
  console.log(err);
});

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};
