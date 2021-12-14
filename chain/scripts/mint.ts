import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  OpenDRM721__factory,
} from "../types";


async function main() {
  const { bob } = await getNamedAccounts();

  const OpenDRM = await deployments.get("OpenDRM721");
  const openDRM = OpenDRM721__factory.connect(
    OpenDRM.address,
    await ethers.getSigner(bob)
  );

  const tx = await openDRM.mint(0);
  await tx.wait();
}

main().catch((err) => {
  console.log(err);
});

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};
