import { task } from "hardhat/config";
import {
  DKGSubscriptionManager__factory,
  OpenDRMCoordinator__factory,
} from "../types";

task("register")
  .addParam("verifyingKey")
  .addParam("decryptingKey")
  .addParam("address")
  .setAction(async (args, hre) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { formatBytes32String, toUtf8Bytes, hexDataLength } = ethers.utils;

    const NuConfig = {
      porterUri: "https://porter-lynx.nucypher.community/",
    };

    const bob = await ethers.getSigner(args.address);

    const coordDeployment = await deployments.get("OpenDRMCoordinator");

    const coordinator = OpenDRMCoordinator__factory.connect(
      coordDeployment.address,
      bob
    );

    const tx = await coordinator.register(
      args.verifyingKey,
      args.decryptingKey
    );

    const res = await tx.wait();

    console.log({ res });
  });
