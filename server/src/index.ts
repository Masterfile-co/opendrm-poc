import "dotenv/config";
import express, { Request } from "express";
import cors from "cors";
import { Wallet, providers, utils } from "ethers";
import { DKGSubscriptionManager__factory } from "./types";
import { TypedListener } from "./types/common";
import { fromHexString } from "./utils";

import { hexlify } from "ethers/lib/utils";
import { PolicyRequestedEvent } from "./types/DKGSubscriptionManager";
import {
  Alice,
  BlockchainPolicyParameters,
  PublicKey,
  RemoteBob,
  SecretKey,
} from "@nucypher/nucypher-ts";
import { HRAC } from "@nucypher/nucypher-core";
import { PreEnactedPolicy } from "@nucypher/nucypher-ts/build/main/src/policies/policy";

let enactedPolicies: { [policyId: string]: PreEnactedPolicy } = {};

const NuConfig = {
  porterUri: "https://porter-ibex.nucypher.community/",
};

console.log("NETWORK", process.env.NETWORK);
console.log("MUMBAI_URL", process.env.MUMBAI_URL);
console.log("ALICE_PRIVATE_KEY", process.env.ALICE_PRIVATE_KEY);
console.log("ALICE_NU_SECRET_KEY", process.env.ALICE_NU_SECRET_KEY);
console.log("DKG_MANAGER_ADDRESS", process.env.DKG_MANAGER_ADDRESS);

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
const providerUrl =
  process.env?.NETWORK == "mumbai"
    ? (process.env.MUMBAI_URL as string)
    : "http://0.0.0.0:8545/";
// const providerUrl = "http://0.0.0.0:8545/";
const provider = new providers.JsonRpcProvider(providerUrl);
const wallet = new Wallet(process.env.ALICE_PRIVATE_KEY as string, provider);

const nuAlice = Alice.fromSecretKey(
  NuConfig,
  SecretKey.fromBytes(Buffer.from(process.env.ALICE_NU_SECRET_KEY as string)),
  provider as providers.Web3Provider
);

const dkgManager = DKGSubscriptionManager__factory.connect(
  process.env.DKG_MANAGER_ADDRESS as string,
  wallet
);

const policyRequestFilter = dkgManager.filters.PolicyRequested();

const handlePolicyRequested: TypedListener<PolicyRequestedEvent> = async (
  subscriptionId,
  consumer,
  _verifyingKey,
  _decryptingKey,
  size,
  threshold,
  startTimestamp,
  endTimestamp,
  label
) => {
  console.log({
    subscriptionId,
    consumer,
    _verifyingKey,
    _decryptingKey,
    size,
    threshold,
    startTimestamp,
    endTimestamp,
    label,
  });

  try {
    // Handle key errors
    const verifyingKey = PublicKey.fromBytes(
      fromHexString(_verifyingKey.slice(2))
    );
    const decryptingKey = PublicKey.fromBytes(
      fromHexString(_decryptingKey.slice(2))
    );

    console.log(
      `handling policy with label: ${label}, publisher verifying key: ${utils.hexlify(
        nuAlice.verifyingKey.toBytes()
      )}, recipient verifying key: ${_verifyingKey}`
    );
    console.log();

    const policyParams: BlockchainPolicyParameters = {
      bob: RemoteBob.fromKeys(decryptingKey, verifyingKey),
      label,
      threshold,
      shares: size,
      startDate: new Date(startTimestamp * 1000),
      endDate: new Date(endTimestamp * 1000),
    };

    const policy = await nuAlice.generatePreEnactedPolicy(policyParams);

    const policyId = utils.hexlify(policy.id.toBytes());

    enactedPolicies[policyId] = policy;

    console.log(
      `Fulfilled ${policyId} for ${_verifyingKey} requested by ${consumer} on subscription ${subscriptionId}`
    );
  } catch (err) {
    console.log("Error fulfilling policy", err);
  }
};

dkgManager.on(policyRequestFilter, handlePolicyRequested);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

interface PolicyQuery {
  policyId: string;
}

app.get("/policy", async (req: Request<any, any, any, PolicyQuery>, res) => {
  let policyId = req.query.policyId;

  const _policy = enactedPolicies[policyId];

  if (_policy) {
    const policy: any = {
      id: hexlify(_policy.id.toBytes()),
      label: _policy.label,
      encryptedTreasureMap: hexlify(_policy.encryptedTreasureMap.toBytes()),
      policyKey: hexlify(_policy.policyKey.toBytes()),
      aliceVerifyingKey: hexlify(_policy.aliceVerifyingKey),
    };
    res.status(200).json(policy);
  } else {
    res.status(404).send("No enacted policy");
  }
});

interface TreasureMapParams {
  policyId: string;
}

app.get("/treasureMap", (req: Request<TreasureMapParams>, res) => {
  const policyId = req.params.policyId;
  const policy = enactedPolicies[policyId];

  if (policy) {
    res.send({
      map: hexlify(policy.encryptedTreasureMap.toBytes()),
    });
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

  let policyId = new HRAC(
    nuAlice.verifyingKey,
    PublicKey.fromBytes(fromHexString(bobVerifyingKey.slice(2))),
    Buffer.from(label)
  ).toBytes();

  res.send({ policyId: utils.hexlify(policyId) });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
