// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deployments, ethers } from "hardhat";
import { OpenDRM721, OpenDRM721__factory } from "../types";

async function main() {
  const signers = await ethers.getSigners();

  const OpenDRM = await deployments.get("OpenDRM721");
  const openDRM = OpenDRM721__factory.connect(OpenDRM.address, signers[0]);

  // await openDRM.mint(0, "label");

  // await openDRM.encryptedTransferFrom(
  //   signers[0].address,
  //   signers[1].address,
  //   0,
  //   "0x00",
  //   "0x02de7992c291623f4d4fad3ce16706e6492f1f5e345f7f19f38c92cd0b6e0aff09",
  //   1640217599,
  //   [
  //     "0xa5624C911cCC8F461064F80a811066068D6890d4",
  //     "0xD27228a1c6994d4C9f24Bd6f294707945d42604f",
  //     "0x9C94524b2e2e261900CD78201c2616565edf4a1a",
  //   ],
  //   { value: "450000000000", gasLimit: 700_000 }
  // );

  console.log(
    await openDRM.getPolicy(
      "0xfd6121134263fbbbb5c12c57124eee79",
      1640217599,
      [
        "0x48970bd1143D7Ca3914BB53f80721B1d3eE21884",
        "0xecB5105846Fd77416550460c71f7fab9f1cfbeba",
        "0x542D4b7f72Cddf9cF020602CA1c9d58482ec3254",
      ],
      { value: 450000000000 }
    )
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
