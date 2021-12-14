// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  OpenDRM721__factory,
} from "../types";

async function main() {
  const { bob, charlie } = await getNamedAccounts();

  // return;
  const OpenDRM = await deployments.get("OpenDRM721");

  const openDRM = OpenDRM721__factory.connect(
    OpenDRM.address,
    await ethers.getSigner(bob)
  );

  const tx = await openDRM.transferFrom(bob, charlie, 2);

  const res = await tx.wait();

  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
