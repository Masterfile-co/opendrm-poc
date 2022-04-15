import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { bob } = await getNamedAccounts();

  // const abioticAliceDeployment = await deployments.get("AbioticAliceManager");

  // const abioticAlice = AbioticAliceManager__factory.connect(
  //   abioticAliceDeployment.address,
  //   await ethers.getSigner(bob)
  // );

  // register our bob
  // await abioticAlice.registerMe(
  //   nuBob.verifyingKey.toBytes(),
  //   nuBob.decryptingKey.toBytes()
  // );

  // await abioticAlice
  //   .connect(await ethers.getSigner(charlie))
  //   .registerMe(
  //     nuCharlie.verifyingKey.toBytes(),
  //     nuCharlie.decryptingKey.toBytes()
  //   );
};

export default deploy;
