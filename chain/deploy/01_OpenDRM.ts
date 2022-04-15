import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const { BigNumber } = ethers;

  const dkgManager = await deployments.get("DKGSubscriptionManager");

  const res = await deploy("OpenDRM721v2", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });

  const nodes = 3; // DKG nodes (fictional)
  const duration = 31536000; // one year (seconds)
  const feeRate = 1000000000;

  await deploy("OpenDRMCoordinator", {
    from: deployer,
    args: [
      dkgManager.address,
      "0xb9015d7B35Ce7c81ddE38eF7136Baa3B1044f313", // PRE SubscriptionManager mumbai
      res.address, // ODRM721 Implementation
      nodes,
      duration,
    ],
    log: true,
    deterministicDeployment: false,
    value: BigNumber.from(nodes).mul(duration).mul(feeRate),
  });
};

deploy.dependencies = ["DKG"];
export default deploy;
