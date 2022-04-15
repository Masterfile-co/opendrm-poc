import "dotenv/config";
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

import "./tasks/mint";
import "./tasks/register";
import "./tasks/deploy";

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
  solidity: "0.8.13",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
    hardhat: {
      // forking: {
      //   url: process.env.MUMBAI_URL || "",
      //   blockNumber: 25941385,
      // },
    },
    localhost: {
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
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
    },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
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
