// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deployments, ethers } from "hardhat";
import {
  IPolicyManager__factory,
  OpenDRM721,
  OpenDRM721__factory,
} from "../types";

async function main() {
  const signers = await ethers.getSigners();

  const policyManager = IPolicyManager__factory.connect(
    "0xaC5e34d3FD41809873968c349d1194D23045b9D2",
    signers[0]
  );

  const tx = await policyManager.policies("");

  const res = await tx.wait();

  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
