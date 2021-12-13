import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { AbioticAliceManager__factory } from "../types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const signers = await ethers.getSigners();

  await deploy("AbioticAliceManager", {
    from: deployer,
    args: [
      "0xaC5e34d3FD41809873968c349d1194D23045b9D2", // PolicyManager Address
      "0x036bd8188183e5c251065d1b22cb52c20f31a88fbf01b1eb75b5cbd5896d76c3e0", // Alice VerifyingKey
    ],
    log: true,
    deterministicDeployment: true,
  });

};

export default deploy;
