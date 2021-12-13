import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { AbioticAliceManager__factory } from "../types";
import { Alice, PublicKey } from "nucypher-ts";
import { Web3Provider } from "@ethersproject/providers";

import PolicyManager from "../types/PolicyManager.json";
import { aliceSecretKey, NuConfig } from "./constants";

async function main() {
  const { alice } = await getNamedAccounts();
  const aliceSigner = await ethers.getSigner(alice);

  const provider = aliceSigner.provider!;

  const nuAlice = Alice.fromSecretKeyBytes(
    NuConfig,
    aliceSecretKey,
    provider as Web3Provider
  );

  const policyManager = new ethers.Contract(
    "0xaC5e34d3FD41809873968c349d1194D23045b9D2",
    PolicyManager.abi,
    aliceSigner
  );

  const MANAGER = await deployments.get("AbioticAliceManager");
  const abioticAliceManager = AbioticAliceManager__factory.connect(
    MANAGER.address,
    aliceSigner
  );

  const policyRequestFilter = abioticAliceManager.filters.PolicyRequested();

  abioticAliceManager.on(
    policyRequestFilter,
    async (requestor, recipient, threshold, shares, paymentPeriods, label) => {
      const bobKeys = await abioticAliceManager.registry(recipient);

      const verifyingKey = PublicKey.fromBytes(
        fromHexString(bobKeys.bobVerifyingKey.slice(2))
      );
      const decryptingKey = PublicKey.fromBytes(
        fromHexString(bobKeys.bobDecryptingKey.slice(2))
      );

      const policy = await nuAlice.generatePolicy({
        label,
        bob: {
          verifyingKey,
          decryptingKey,
        },
        threshold: threshold.toNumber(),
        shares: shares.toNumber(),
        paymentPeriods: paymentPeriods.toNumber(),
      });

      const _nodes = policy.ursulas.map((ursula) => ursula.checksumAddress);
      // const _kfrags = policy.ursulas.map(
      //   (ursula) => `0x${ursula.encryptingKey}`
      // );

      const policytx = await abioticAliceManager.fulfillPolicy(
        policy.id.toBytes(),
        policy.expirationTimestamp,
        policy.valueInWei,
        _nodes,
      );
      await policytx.wait();

      const policyId = ethers.utils.hexlify(policy.id.toBytes());

      console.log(policyId);

      const chainPolicy = await policyManager.policies(policyId);

      console.log(chainPolicy);
    }
  );
}

main().catch((err) => {
  console.log(err);
});

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};
