import { Bob } from "nucypher-ts";

export const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

export const aliceSecretKey = Buffer.from("fake-secret-key-32-bytes-alice-x");

export const bobSecretKey = Buffer.from("fake-secret-key-32-bytes-bob-xxx");
export const nuBob = Bob.fromSecretKey(NuConfig, bobSecretKey);

export const charlieSecretKey = Buffer.from("fake-secret-key-32-bytes-charlie");
export const nuCharlie = Bob.fromSecretKey(NuConfig, charlieSecretKey);
