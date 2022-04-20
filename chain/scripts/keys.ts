import { Bob, SecretKey } from "@nucypher/nucypher-ts";
import { ethers } from "ethers";

// Run with `ts-node -r esm ./scripts/keys.ts <secret-key>`
// dumbkey

const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

const { zeroPad, hexlify } = ethers.utils;

const secretKey = zeroPad(Buffer.from(process.argv[2]), 32);

const key = SecretKey.fromBytes(secretKey);
const nuBob = Bob.fromSecretKey(NuConfig, key);

console.log("verifying key", hexlify(nuBob.verifyingKey.toBytes()));
console.log("decrypting key", hexlify(nuBob.decryptingKey.toBytes()));
