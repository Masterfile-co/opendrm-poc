import { PublicKey, RemoteBob } from "@nucypher/nucypher-ts";
import { EncryptedTreasureMap } from "@nucypher/nucypher-core";

import { dkgUrl } from "utils/config";
import axios, { AxiosResponse } from "axios";
import {
  hexlify,
  keccak256,
  solidityPack,
  toUtf8Bytes,
} from "ethers/lib/utils";
import { fromHexString } from "utils";
import { EnactedPolicy } from "utils/types";

interface GetPolicyResponse {
  id: string;
  label: string;
  encryptedTreasureMap: string;
  policyKey: string;
  aliceVerifyingKey: string;
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

  const getPolicy = async (policyId: string): Promise<EnactedPolicy> => {
    const params = { policyId };

    return axios
      .get(`${dkgUrl}/policy`, { params })
      .then((res: AxiosResponse<GetPolicyResponse>) => {
        const { policyKey, aliceVerifyingKey, encryptedTreasureMap } = res.data;

        return {
          policyEncryptingKey: PublicKey.fromBytes(fromHexString(policyKey)),
          publisherVerifyingKey: PublicKey.fromBytes(
            fromHexString(aliceVerifyingKey)
          ),
          encryptedTreasureMap: EncryptedTreasureMap.fromBytes(
            fromHexString(encryptedTreasureMap)
          ),
        };
      });
  };

  const getPolicyId = async (label: string, bob: RemoteBob) => {
    const params = { label, verifyingKey: hexlify(bob.verifyingKey.toBytes()) };

    return axios
      .get(`${dkgUrl}/policyId`, { params })
      .then((res) => res.data.policyId);
  };

  /**
   * Get Alice's verfying key
   * @returns Alice's verfiying key
   */
  const getVerifyingKey = async () => {
    return axios
      .get(`${dkgUrl}/verifyingKey`, {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        return PublicKey.fromBytes(new Uint8Array(data));
      });
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

  return { getEncryptingKey, getPolicyId, getLabel, getPolicy };
}
