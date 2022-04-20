import { task } from "hardhat/config";
import {
  DKGSubscriptionManager__factory,
  OpenDRMCoordinator__factory,
} from "../types";

task("deploy-clone")
  .addParam("name")
  .addParam("symbol")
  .setAction(async (args, hre) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deployer: deployerAcct } = await getNamedAccounts();

    const deployer = await ethers.getSigner(deployerAcct);

    const coordDeployment = await deployments.get("OpenDRMCoordinator");

    const coordinator = OpenDRMCoordinator__factory.connect(
      coordDeployment.address,
      deployer
    );

    const deployment = await coordinator.getNextDeployment();

    const tx = await coordinator.deployOpenDRM(args.name, args.symbol);

    const res = await tx.wait();

    console.log({ deployment });
  });
