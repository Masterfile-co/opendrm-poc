import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const AbioticAlice = await deployments.get("AbioticAliceManager");

  await deploy("OpenDRM721", {
    from: deployer,
    args: ["0xaC5e34d3FD41809873968c349d1194D23045b9D2", AbioticAlice.address],
    log: true,
    deterministicDeployment: false,
  });

  const OpenDRM721 = await deployments.get("OpenDRM721");
  const signer = await ethers.getSigner(deployer);

  const tx = await signer.sendTransaction({
    to: OpenDRM721.address,
    value: ethers.utils.parseEther("0.5"),
  });
  await tx.wait()
};

export default deploy;
