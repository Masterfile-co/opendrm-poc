// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deployments, ethers } from "hardhat";
import { OpenDRM721, OpenDRM721__factory } from "../types";
import { PolicyManager } from "../types/PolicyManager";
import PolicyManagerAbi from "../types/PolicyManager.json";

async function main() {
  const signers = await ethers.getSigners();

  const policyManager = new ethers.Contract(
    "0xaC5e34d3FD41809873968c349d1194D23045b9D2",
    PolicyManagerAbi.abi,
    signers[0]
  ) as PolicyManager;

  // console.log(
  //   await policyManager["calculateRefundValue(bytes16)"](
  //     "0x40e593fa637fc70c917f1558ac37678f"
  //   )
  // );

  // return;
  const OpenDRM = await deployments.get("OpenDRM721");
  const openDRM = OpenDRM721__factory.connect(OpenDRM.address, signers[1]);

  const tx = await openDRM.transferFrom(
    signers[1].address,
    signers[0].address,
    0
  );

  const res = await tx.wait();

  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
