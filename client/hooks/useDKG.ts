import { PublicKey, RemoteBob } from "@nucypher/nucypher-ts";
import { EncryptedTreasureMap } from "@nucypher/nucypher-core";

import { dkgUrl } from "utils/config";
import axios, { AxiosResponse } from "axios";
import { hexlify } from "ethers/lib/utils";
import { delay, fromBase64, fromHexString, toHexString } from "utils";
import { EnactedPolicyInfo } from "utils/types";

interface GetPolicyResponse {
  id: string;
  label: string;
  policyKey: string;
  encryptedTreasureMap: string;
  aliceVerifyingKey: string;
  // revocationKit: Uint8Array[];
  size: number;
  startTimestamp: number;
  endTimestamp: number;
}

export function useDKG() {
  const getEncryptingKey = async (label: string): Promise<PublicKey> => {
    return axios
      .get(`${dkgUrl}/encryptingKey?label=${label}`, {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        return PublicKey.fromBytes(new Uint8Array(data));
      });
  };

  const getPolicy = async (policyId: string): Promise<EnactedPolicyInfo> => {
    const params = { policyId };

    return axios
      .get(`${dkgUrl}/policy`, { params })
      .then((res: AxiosResponse<GetPolicyResponse>) => {
        const { policyKey, aliceVerifyingKey, encryptedTreasureMap } = res.data;

        console.log("policy", fromHexString(policyKey).length);
        console.log(
          "aliceVerifyingKey",
          fromHexString(aliceVerifyingKey).length
        );
        console.log(
          "encryptedTreasureMap",
          fromBase64(encryptedTreasureMap).length
        );

        return {
          policyEncryptingKey: PublicKey.fromBytes(fromHexString(policyKey)),
          publisherVerifyingKey: PublicKey.fromBytes(
            fromHexString(aliceVerifyingKey)
          ),
          encryptedTreasureMap: EncryptedTreasureMap.fromBytes(
            fromBase64(encryptedTreasureMap)
          ),
        };
      });
  };

  const getPolicyId = async (
    label: string,
    bob: RemoteBob
  ): Promise<string> => {
    const params = {
      label,
      verifyingKey: toHexString(bob.verifyingKey.toBytes()),
    };

    return axios
      .get(`${dkgUrl}/policyId`, { params })
      .then((res) => res.data.policyId);
  };

  const getLabel = (
    odrm721Address: string,
    chainId: number,
    tokenId: number
  ) => {
    return (
      odrm721Address.toLowerCase() + chainId.toString() + tokenId.toString()
    );
  };

  const listenForPolicy = async (
    policyId: string
  ): Promise<EnactedPolicyInfo> => {
    await delay(3);
    let attemptCount = 0;
    let policy: EnactedPolicyInfo | null = null;

    while (attemptCount < 5) {
      try {
        policy = await getPolicy(policyId);
        break;
      } catch (err) {
        console.log({ err });
        attemptCount++;
        await delay(1);
      }
    }

    if (!policy) {
      throw new Error("Policy not found");
    }

    return policy;
  };

  return {
    getEncryptingKey,
    getPolicyId,
    getLabel,
    getPolicy,
    listenForPolicy,
  };
}
