import "dotenv/config";
import express from "express";
import cors from "cors";
import { Wallet, providers, utils } from "ethers";
import { Alice, EnactedPolicy, PublicKey } from "nucypher-ts";
import { AbioticAliceManager__factory } from "./types";
import { TypedListener } from "./types/common";
import { PolicyRequestedEvent } from "./types/AbioticAliceManager";
import { fromHexString } from "./utils";
import { HRAC } from "nucypher-ts/build/main/src/policies/hrac";

let enactedPolicies: { [policyId: string]: EnactedPolicy } = {};

const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
const providerUrl =
  process.env?.NETWORK == "goerli"
    ? (process.env.GOERLI_URL as string)
    : "http://0.0.0.0:8545/";
const provider = new providers.JsonRpcProvider(providerUrl);
const wallet = new Wallet(process.env.ALICE_PRIVATE_KEY as string, provider);

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
  const bobKeys = await abioticAliceManager.registry(recipient);

  const verifyingKey = PublicKey.fromBytes(
    fromHexString(bobKeys.bobVerifyingKey.slice(2))
  );
  const decryptingKey = PublicKey.fromBytes(
    fromHexString(bobKeys.bobDecryptingKey.slice(2))
  );

  console.log(
    `handling policy with label: ${label}, publisher verifying key: ${utils.hexlify(
      nuAlice.verifyingKey.toBytes()
    )}, recipient verifying key: ${bobKeys.bobVerifyingKey}`
  );
  console.log();

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
    console.log("Error fulfilling policy", err);
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
    res.status(404).send("No enacted policy");
  }
});

app.get("/verifyingKey", (req, res) => {
  res.send(Buffer.from(nuAlice.verifyingKey.toBytes()));
});

app.get("/encryptingKey", (req, res) => {
  const label = req.query.label as string;
  const encryptingKey = nuAlice.getPolicyEncryptingKeyFromLabel(label);

  res.send(Buffer.from(encryptingKey.toBytes()));
});

app.get("/policyId", (req, res) => {
  let label = req.query.label as string;
  let bobVerifyingKey = req.query.verifyingKey as string;

  let policyId = HRAC.derive(
    nuAlice.verifyingKey.toBytes(),
    fromHexString(bobVerifyingKey.slice(2)),
    label
  ).toBytes();
  res.send({ policyId: utils.hexlify(policyId) });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
