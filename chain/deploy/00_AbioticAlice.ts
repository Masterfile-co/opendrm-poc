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

  // Use signer1 as bob
  const abioticAliceDeployment = await deployments.get("AbioticAliceManager");

  const abioticAlice = AbioticAliceManager__factory.connect(
    abioticAliceDeployment.address,
    signers[1]
  );

  // register our bob
  // await abioticAlice.registerMe(
  //   "0x02de7992c291623f4d4fad3ce16706e6492f1f5e345f7f19f38c92cd0b6e0aff09",
  //   "0x02de7992c291623f4d4fad3ce16706e6492f1f5e345f7f19f38c92cd0b6e0aff09"
  // );
};

export default deploy;
