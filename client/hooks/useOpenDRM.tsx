import { hexlify } from "ethers/lib/utils";
import { BlockchainPolicyParameters } from "nucypher-ts";
import { HRAC } from "nucypher-ts/build/main/src/policies/hrac";
import { useState } from "react";
import { useEncryptData } from "./components/useEncryptData";
import { useMetadata } from "./components/useMetadata";
import { useAbioticAlice } from "./nucypher/useAbioticAlice";
import { useBob } from "./nucypher/useBob";
import { useEnrico } from "./nucypher/useEnrico";

import sha3 from "js-sha3";
import { IPolicyManager__factory, OpenDRM721__factory } from "types";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export function useOpenDRM() {
  const { library, account } = useWeb3React<Web3Provider>("AbioticAlice");
  const encryptDataProps = useEncryptData();
  const metadataProps = useMetadata();
  const { label, cleartext, setMessageKit } = encryptDataProps;
  const { metadata, setMetadata } = metadataProps;
  const {
    requestEncryptingKey,
    requestPolicy,
    publicKey,
    grantPolicy: aliceGrant,
  } = useAbioticAlice();
  const { decryptingKey, verifyingKey } = useBob({
    secretKey: "fake-secret-key-32-bytes-bob-xxx",
  });

  const encryptCleartext = () => {
    const encryptingKey = requestEncryptingKey(label);
    const { encryptMessage } = useEnrico({ encryptingKey });
    const messageKit = encryptMessage(cleartext);

    setMessageKit(messageKit);

    setMetadata({
      ...metadata,
      encryptingKey: messageKit.capsule.toBytes().toString(),
      image: messageKit.ciphertext.toString(),
    });
  };

  const grantPolicy = async () => {
    const policyParams: BlockchainPolicyParameters = {
      label,
      bob: { decryptingKey, verifyingKey },
      threshold: 2,
      shares: 3,
      paymentPeriods: 3,
    };

    // const req = await requestPolicy(policyParams);
    const req = await aliceGrant(policyParams);

    console.log(req);
    console.log(hexlify(req.id.toBytes()));
  };

  const deriveId = async () => {
    const policyParams: BlockchainPolicyParameters = {
      label,
      bob: { decryptingKey, verifyingKey },
      threshold: 2,
      shares: 3,
      paymentPeriods: 3,
    };

    const req = await requestPolicy(policyParams);

    const addrs = req.ursulas.map((ursula) => ursula.checksumAddress);

    const PolicyManager = IPolicyManager__factory.connect(
      "0xaC5e34d3FD41809873968c349d1194D23045b9D2",
      library!.getSigner()
    );

    const openDRM = OpenDRM721__factory.connect(
      "0x1BE58B1529eE4b6C76953C0ff5151cF5D895820a",
      library!.getSigner()
    );

    // await PolicyManager.createPolicy(
    //   hexlify(req.id.toBytes()),
    //   account!,
    //   req.expirationTimestamp,
    //   addrs,
    //   { value: req.valueInWei, gasLimit: 350_000 }
    // );

    await openDRM.getPolicy(
      hexlify(req.id.toBytes()),
      req.expirationTimestamp,
      addrs,
      { value: req.valueInWei, gasLimit: 350_000 }
    );
  };

  return {
    encryptDataProps,
    metadataProps,
    encryptCleartext,
    grantPolicy,
    deriveId,
  };
}

export const toBytes = (str: string): Uint8Array =>
  new TextEncoder().encode(str);

export const keccakDigest = (m: Uint8Array): Uint8Array =>
  fromHexString(sha3.keccak_256(m)).slice(0, 32);

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};
