import "dotenv/config";
import express from "express";
import { Wallet, providers, utils } from "ethers";
import { Alice, EnactedPolicy, PublicKey } from "nucypher-ts";
import { AbioticAliceManager__factory } from "./types";
import { TypedListener } from "./types/common";
import { PolicyRequestedEvent } from "./types/AbioticAliceManager";
import { fromHexString } from "./utils";

let enactedPolicies: { [policyId: string]: EnactedPolicy } = {};

const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

const app = express();
const port = process.env.PORT || 3001;

const provider = new providers.JsonRpcProvider("http://0.0.0.0:8545/");
const wallet = new Wallet(
  process.env.ALICE_ETH_PRIVATE_KEY as string,
  provider
);

const nuAlice = Alice.fromSecretKeyBytes(
  NuConfig,
  Buffer.from(process.env.ALICE_NU_SECRET_KEY as string),
  provider as providers.Web3Provider
);

const abioticAliceManager = AbioticAliceManager__factory.connect(
  process.env.ABIOTIC_ALICE_MANAGER_ADDRESS as string,
  wallet
);

const policyRequestFilter = abioticAliceManager.filters.PolicyRequested();

const handlePolicyRequested: TypedListener<PolicyRequestedEvent> = async (
  requestor,
  recipient,
  threshold,
  shares,
  paymentPeriods,
  label
) => {
  console.log(recipient);

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
  const policyId = utils.hexlify(policy.id.toBytes());
  console.log(policyId);

  const _nodes = policy.ursulas.map((ursula) => ursula.checksumAddress);

  try {
    const policytx = await abioticAliceManager.fulfillPolicy(
      policy.id.toBytes(),
      policy.expirationTimestamp,
      policy.valueInWei,
      _nodes
    );
    await policytx.wait();

    enactedPolicies[policyId] = policy;

    console.log(
      `Fulfilled ${policyId} for ${recipient} requested by ${requestor}`
    );
  } catch (err) {
    // console.log("Error fulfilling policy", err);
  }
};

abioticAliceManager.on(policyRequestFilter, handlePolicyRequested);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/policy", (req, res) => {
  let policyId = req.query.policyId as string;

  const policy = enactedPolicies[policyId];

  if (policy) {
    res.send(JSON.stringify(policy, null, 4));
  } else {
    res.status(404).send("No enacted policy")
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
