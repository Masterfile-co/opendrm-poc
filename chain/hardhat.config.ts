import "dotenv/config";
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const accounts = [];

process.env.DEPLOYER_PRIVATE_KEY !== undefined
  ? accounts.push(process.env.DEPLOYER_PRIVATE_KEY)
  : null;
process.env.ALICE_PRIVATE_KEY !== undefined
  ? accounts.push(process.env.ALICE_PRIVATE_KEY)
  : null;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined &&
        process.env.ALICE_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY, process.env.ALICE_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      // mining: {
      //   interval: 2000,
      // },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      31337: "0x6899A52CB506cF268dD8Df2F47F1333885c92d59",
      goerli: "0x6899A52CB506cF268dD8Df2F47F1333885c92d59",
    },
    alice: {
      default: 1,
      31337: "0xf2aD32adFeD461645f34fB21A460cce43F7980d5",
      goerli: "0xf2aD32adFeD461645f34fB21A460cce43F7980d5",
    },
    bob: {
      default: 2,
      31337: "0xF33F339F4B4E3B59B0716809D7A16Dd32870980F",
      goerli: "0xF33F339F4B4E3B59B0716809D7A16Dd32870980F",
    },
    charlie: {
      default: 3,
    },
  },
  typechain: {
    outDir: process.env.TYPECHAIN_DIR ? process.env.TYPECHAIN_DIR : "types",
  },
};

export default config;
