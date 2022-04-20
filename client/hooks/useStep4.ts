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
import { useOpenDRM } from "./useOpenDRM";

export function useStep4() {
  const { push } = useRouter();
  const { metadata, policy, secret, steps } = useAppState();
  const [cleartext, setCleartext] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { setStepDone } = useOpenDRM();

  const decrypt = async () => {
    if (!secret) {
      alert("Please register Nu account");
      return;
    }
    if (!metadata || !policy) {
      alert("Please mint a new OpenDRM NFT");
      return;
    }

    setLoading(true);

    const bob = bobFromSecret(secret);

    const res = await bob.retrieveAndDecrypt(
      policy.policyEncryptingKey,
      policy.publisherVerifyingKey,
      [metadata.msgKit],
      policy.encryptedTreasureMap
    );

    setCleartext(fromBytes(res[0]));
    setLoading(false);
  };

  const nextPage = () => {
    setStepDone(3);
    push("/step5");
  };

  return {
    decrypt,
    nextPage,
    cleartext,
    active: steps[3].active,
    metadata,
    policy,
    loading,
  };
}
