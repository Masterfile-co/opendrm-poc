import { CallOverrides, Overrides } from "ethers";
import { task } from "hardhat/config";
import {
  DKGSubscriptionManager__factory,
  OpenDRM721v2__factory,
  OpenDRMCoordinator__factory,
} from "../types";

task("mint")
  .addParam("tokenId")
  .setAction(async (args, hre) => {
    
    const { deployments, getNamedAccounts, ethers } = hre;

    const { bob: bobAddress, charlie } = await getNamedAccounts();

    const bob = await ethers.getSigner(bobAddress);
    

    const odrm = OpenDRM721v2__factory.connect(
      "0x743b40E0467a951972B3Bf7D6AA1d82364de2EF6",
      bob
    );

    const overrides: CallOverrides = {
      value: ethers.BigNumber.from(1000000000).mul(3).mul(86000).mul(100),
    };
    const tx = await odrm.mint(args.tokenId, overrides);
    const res = await tx.wait();

  });
