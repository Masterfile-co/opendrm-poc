import { TreasureMap } from "@nucypher/nucypher-core";
import { Bob, defaultConfiguration } from "@nucypher/nucypher-ts";
import { Porter } from "@nucypher/nucypher-ts/build/main/src/characters/porter";
import { PolicyMessageKit } from "@nucypher/nucypher-ts/build/main/src/kits/message";
import { ChainId } from "@nucypher/nucypher-ts/build/main/src/types";
import axios from "axios";
import { useRouter } from "next/router";
import { useAppState } from "providers/OpenDRMProvider";
import { useState } from "react";
import {
  bobFromSecret,
  fromBytes,
  toBase64,
  toHexString,
  toSecretKey,
} from "utils";

export function useStep4() {
  const { push } = useRouter();
  const { metadata, policy, secret, steps } = useAppState();
  const [cleartext, setCleartext] = useState<string | undefined>();

  const decrypt = async () => {
    if (!secret) {
      alert("Please register Nu account");
      return;
    }
    if (!metadata || !policy) {
      alert("Please mint a new OpenDRM NFT");
      return;
    }

    const decryptedMap: TreasureMap = policy.encryptedTreasureMap.decrypt(
      toSecretKey(secret),
      policy.publisherVerifyingKey
    );

    console.log({ decryptedMap });
    console.log({ destinations: decryptedMap.destinations });
    console.log({
      destinations: decryptedMap.destinations.map((destination: any) =>
        toHexString(destination[0])
      ),
    });

    const retrievalKit = PolicyMessageKit.fromMessageKit(
      metadata.msgKit,
      policy.policyEncryptingKey,
      decryptedMap.threshold
    ).asRetrievalKit();

    console.log({ retrievalKit });

    const porter = new Porter(defaultConfiguration(ChainId.MUMBAI).porterUri);
    const bob = bobFromSecret(secret);

    const data = {
      treasure_map: toBase64(decryptedMap.toBytes()),
      retrieval_kits: [toBase64(retrievalKit.toBytes())],
      alice_verifying_key: toHexString(policy.publisherVerifyingKey.toBytes()),
      bob_encrypting_key: toHexString(bob.decryptingKey.toBytes()),
      bob_verifying_key: toHexString(bob.verifyingKey.toBytes()),
    };

    // const cfragRes = await porter.retrieveCFrags(
    //   decryptedMap,
    //   [retrievalKit],
    //   policy.publisherVerifyingKey,
    //   bob.decryptingKey,
    //   bob.verifyingKey
    // );

    const resp = await axios.post(
      `${defaultConfiguration(ChainId.MUMBAI).porterUri}/retrieve_cfrags`,
      data
    );

    console.log({ resp });

    // const res = await bob.retrieveAndDecrypt(
    //   policy.policyEncryptingKey,
    //   policy.publisherVerifyingKey,
    //   [metadata.msgKit],
    //   policy.encryptedTreasureMap
    // );

    // setCleartext(fromBytes(res[0]));
  };

  const nextPage = () => {
    push("/step5");
  };

  return {
    decrypt,
    nextPage,
    cleartext,
    active: steps[3].active,
    metadata,
    policy,
  };
}
