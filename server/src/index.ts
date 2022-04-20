import "dotenv/config";
import express, { Request } from "express";
import cors from "cors";
import { Wallet, providers } from "ethers";
import { DKGSubscriptionManager__factory } from "./types";
import { TypedListener } from "./types/common";
import {
  fromHexString,
  keccakDigest,
  toBase64,
  toBytes,
  toHexString,
} from "./utils";

import { PolicyRequestedEvent } from "./types/DKGSubscriptionManager";
import {
  Alice,
  BlockchainPolicyParameters,
  Bob,
  defaultConfiguration,
  PublicKey,
  RemoteBob,
  SecretKey,
} from "@nucypher/nucypher-ts";
import { HRAC } from "@nucypher/nucypher-core";
import {
  BlockchainPolicy,
  PreEnactedPolicy,
} from "@nucypher/nucypher-ts/build/main/src/policies/policy";
import { Porter } from "@nucypher/nucypher-ts/build/main/src/characters/porter";
import { ChainId } from "@nucypher/nucypher-ts/build/main/src/types";
import sha3 from "js-sha3";
import { keccak256 } from "ethers/lib/utils";

let enactedPolicies: { [policyId: string]: PreEnactedPolicy } = {};

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
console.log({ providerUrl });
const provider = new providers.JsonRpcProvider(providerUrl);
const wallet = new Wallet(process.env.ALICE_PRIVATE_KEY as string, provider);

const nuAlice = Alice.fromSecretKey(
  defaultConfiguration(ChainId.MUMBAI),
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
  policyId,
  label,
  { verifyingKey, decryptingKey, size, threshold, startTimestamp, endTimestamp }
) => {
  console.log({
    subscriptionId,
    consumer,
    policyId,
    verifyingKey,
    decryptingKey,
    size,
    threshold,
    startTimestamp,
    endTimestamp,
    label,
  });

  try {
    // Handle key errors
    const _verifyingKey = PublicKey.fromBytes(
      fromHexString(verifyingKey.slice(2))
    );
    const _decryptingKey = PublicKey.fromBytes(
      fromHexString(decryptingKey.slice(2))
    );

    console.log(
      `handling policy with label: ${label}, publisher verifying key: ${toHexString(
        nuAlice.verifyingKey.toBytes()
      )}, recipient verifying key: ${verifyingKey}`
    );

    const policyParams: BlockchainPolicyParameters = {
      bob: RemoteBob.fromKeys(_decryptingKey, _verifyingKey),
      label,
      threshold,
      shares: size,
      startDate: new Date(startTimestamp * 1000),
      endDate: new Date(endTimestamp * 1000),
    };

    const { delegatingKey, verifiedKFrags } = nuAlice.generateKFrags(
      policyParams.bob,
      policyParams.label,
      policyParams.threshold,
      policyParams.shares
    );

    const policy = new BlockchainPolicy(
      nuAlice,
      label,
      policyParams.bob,
      verifiedKFrags,
      delegatingKey,
      policyParams.threshold,
      policyParams.shares,
      policyParams.startDate,
      policyParams.endDate
    );

    const porter = new Porter(defaultConfiguration(ChainId.MUMBAI).porterUri);

    const ursulas = await porter.getUrsulas(policyParams.shares);

    // const newId = sha3
    //   .sha3_256(
    //     new Uint8Array([
    //       ...nuAlice.verifyingKey.toBytes(),
    //       ...policyParams.bob.verifyingKey.toBytes(),
    //       ...toBytes(label),
    //     ])
    //   )
    //   .slice(0, 32);

    //@ts-ignore
    policy.hrac = HRAC.fromBytes(fromHexString(policyId.slice(2)));

    const enactedPolicy = await policy.generatePreEnactedPolicy(ursulas);

    // const porter = new Porter(defaultConfiguration(ChainId.MUMBAI).porterUri);

    // const ursulas = await porter.getUrsulas(policyParams.shares);

    // console.log({ ursulas });

    // const policy = await nuAlice.generatePreEnactedPolicy(
    //   policyParams,
    //   ursulas.map((ursula) => ursula.checksumAddress)
    // );

    // console.log({ policy });

    // const policyId = toHexString(policy.id.toBytes());

    // console.log({ length: nuAlice.verifyingKey.toBytes().length });
    // console.log({
    //   length: fromHexString(toHexString(nuAlice.verifyingKey.toBytes())).length,
    // });

    enactedPolicies[policyId] = enactedPolicy;

    console.log(
      `Fulfilled ${policyId} for ${verifyingKey} requested by ${consumer} on subscription ${subscriptionId}`
    );
  } catch (err) {
    console.log("Error fulfilling policy", err);
  }
};

dkgManager.on(policyRequestFilter, handlePolicyRequested);

app.get("/", async (req, res) => {
  // console.log(await dkgManager.verifyingKey());
  // console.log(toHexString(nuAlice.verifyingKey.toBytes()));

  // const secretKey = zeroPad(Buffer.from("dumbkey"), 32);
  // const key = SecretKey.fromBytes(secretKey);
  // const nuBob = Bob.fromSecretKey(defaultConfiguration(ChainId.MUMBAI), key);

  // console.log({
  //   publisher_verifying_key: toHexString(nuAlice.verifyingKey.toBytes()),
  // });
  // console.log({
  //   bob_verifying_key: toHexString(nuBob.verifyingKey.toBytes()),
  // });

  const publisher_verifying_key =
    "036bd8188183e5c251065d1b22cb52c20f31a88fbf01b1eb75b5cbd5896d76c3e0";

  const bob_verifying_key =
    "0366421e0ed6d7057f4ee9f14c07aff444fb311dab8f058d69e37f7e1343729d04";

  const label = "example-label";

  const hrac = new HRAC(
    PublicKey.fromBytes(fromHexString(publisher_verifying_key)),
    PublicKey.fromBytes(fromHexString(bob_verifying_key)),
    toBytes(label)
  );

  console.log({ hrac: toHexString(hrac.toBytes()) });

  const newId = sha3
    .sha3_256(
      new Uint8Array([
        ...fromHexString(publisher_verifying_key),
        ...fromHexString(bob_verifying_key),
        ...toBytes(label),
      ])
    )
    .slice(0, 32);

  console.log({ newId: newId });

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
      id: toHexString(_policy.id.toBytes()),
      label: _policy.label,
      policyKey: toHexString(_policy.policyKey.toBytes()),
      encryptedTreasureMap: toBase64(_policy.encryptedTreasureMap.toBytes()),
      // revocationKit: _policy.revocationKit.revocationOrders.map((order) =>
      //   order.toBytes()
      // ),
      aliceVerifyingKey: toHexString(nuAlice.verifyingKey.toBytes()),
      size: _policy.size,
      startTimestamp: _policy.startTimestamp.getTime() / 1000,
      endTimestamp: _policy.endTimestamp.getTime() / 1000,
    };
    res.status(200).json(policy);
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

  // let policyId = new HRAC(
  //   nuAlice.verifyingKey,
  //   PublicKey.fromBytes(fromHexString(bobVerifyingKey)),
  //   Buffer.from(label)
  // );

  // const policyId = sha3
  //   .keccak256(
  //     new Uint8Array([
  //       ...nuAlice.verifyingKey.toBytes(),
  //       ...fromHexString(bobVerifyingKey),
  //       ...toBytes(label),
  //     ])
  //   )
  //   .slice(0, 32);

  const policyId = keccak256([
    ...nuAlice.verifyingKey.toBytes(),
    ...fromHexString(bobVerifyingKey),
    ...toBytes(label),
  ]);

  res.send({ policyId });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
