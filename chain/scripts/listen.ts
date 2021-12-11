import { deployments, ethers } from "hardhat";
import {
  AbioticAliceManager__factory,
  IPolicyManager__factory,
  OpenDRM721,
  OpenDRM721__factory,
} from "../types";
import { PolicyRequestedEvent } from "../types/AbioticAliceManager";
import { TypedListener } from "../types/common";
import { Alice, Bob, PublicKey, RemoteBob } from "nucypher-ts";
import { Web3Provider } from "@ethersproject/providers";

import PolicyManager from "../types/PolicyManager.json";

const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

async function main() {
  const secretKey = Buffer.from("fake-secret-key-32-bytes-alice-x");
  const signers = await ethers.getSigners();

  const provider = signers[2].provider!;

  const alice = Alice.fromSecretKeyBytes(
    NuConfig,
    secretKey,
    provider as Web3Provider
  );

  const bob1 = Bob.fromSecretKey(
    NuConfig,
    Buffer.from("fake-secret-key-32-bytes-bob-xxx")
  );

  const bob2 = Bob.fromSecretKey(
    NuConfig,
    Buffer.from("fake-secret-key-32-bytes-bob2-xx")
  );

  //   const policyManager = IPolicyManager__factory.connect(
  //     "0xaC5e34d3FD41809873968c349d1194D23045b9D2",
  //     signers[0]
  //   );

  const policyManager = new ethers.Contract(
    "0xaC5e34d3FD41809873968c349d1194D23045b9D2",
    PolicyManager.abi,
    signers[0]
  );

  const MANAGER = await deployments.get("AbioticAliceManager");
  const abioticAliceManager = AbioticAliceManager__factory.connect(
    MANAGER.address,
    signers[2]
  );

  await abioticAliceManager
    .connect(signers[0])
    .registerMe(bob1.verifyingKey.toBytes(), bob1.decryptingKey.toBytes());

  await abioticAliceManager
    .connect(signers[1])
    .registerMe(bob2.verifyingKey.toBytes(), bob2.decryptingKey.toBytes());

  const OpenDRM = await deployments.get("OpenDRM721");
  const openDRM = OpenDRM721__factory.connect(OpenDRM.address, signers[1]);

  const tx1 = await openDRM.mint(0);
  await tx1.wait();

  const policyRevokedFilter = openDRM.filters.PolicyRevoked();

  openDRM.on(policyRevokedFilter, (policyId) => {
    console.log("Policy Revoked", policyId);
  });

  const policyRequestFilter = abioticAliceManager.filters.PolicyRequested();

  const encoder = new TextEncoder();

  abioticAliceManager.on(
    policyRequestFilter,
    async (requestor, recipient, label) => {
      const bobKeys = await abioticAliceManager.registry(recipient);

      const verifyingKey = PublicKey.fromBytes(
        fromHexString(bobKeys.bobVerifyingKey.slice(2))
      );
      const decryptingKey = PublicKey.fromBytes(
        fromHexString(bobKeys.bobDecryptingKey.slice(2))
      );

      const policy = await alice.generatePolicy({
        label,
        bob: {
          verifyingKey,
          decryptingKey,
        },
        threshold: 2,
        shares: 3,
        paymentPeriods: 3,
      });

      const _nodes = policy.ursulas.map((ursula) => ursula.checksumAddress);
      const _kfrags = policy.ursulas.map(
        (ursula) => `0x${ursula.encryptingKey}`
      );

      const policytx = await abioticAliceManager.createPolicy(
        policy.id.toBytes(),
        policy.expirationTimestamp,
        _nodes,
        _kfrags,
        { value: policy.valueInWei }
      );
      await policytx.wait();

      console.log(ethers.utils.hexlify(policy.id.toBytes()));

      const chainPolicy = await policyManager.policies(policy.id.toBytes());

      console.log(chainPolicy);

      //   await openDRM.revokePolicy(policy.id.toBytes());
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
