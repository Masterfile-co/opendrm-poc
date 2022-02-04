import { Bob, PublicKey } from "nucypher-ts";
import axios, { AxiosResponse } from "axios";
import { HRAC } from "nucypher-ts/build/main/src/policies/hrac";
import { Ursula } from "nucypher-ts/build/main/src/characters/porter";
import { fromHexString } from "utils";
import { Capsule } from "umbral-pre";
import { EncryptedTreasureMap } from "nucypher-ts/build/main/src/policies/collections";
import { hexlify, keccak256, solidityPack } from "ethers/lib/utils";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { abioticAliceUrl } = publicRuntimeConfig;

console.log("abioticAliceUrl", abioticAliceUrl);

export function useAbioticAlice() {
  /**
   * Get Alice's verfying key
   * @returns Alice's verfiying key
   */
  const getVerifyingKey = async () => {
    return axios
      .get(`${abioticAliceUrl}/verifyingKey`, {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        return PublicKey.fromBytes(new Uint8Array(data));
      });
  };

  /**
   * Get the key to encrypt cleartext so that policy holder can access
   * @param label label of policy
   * @returns encrypting key for policy
   */
  const getEncryptingKey = async (label: string) => {
    return axios
      .get(`${abioticAliceUrl}/encryptingKey?label=${label}`, {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        return PublicKey.fromBytes(new Uint8Array(data));
      });
  };

  const getPolicyId = async (label: string, bob: Bob) => {
    const aliceVerifyingKey = await getVerifyingKey();

    return keccak256(
      solidityPack(
        ["bytes", "bytes", "string"],
        [
          hexlify(aliceVerifyingKey.toBytes()),
          hexlify(bob.verifyingKey.toBytes()),
          label,
        ]
      )
    ).slice(0, 34);
  };

  const getPolicy = async (policyId: string) => {
    const params = { policyId };

    const resp: AxiosResponse<GetPolicyResponse> = await axios.get(
      `${abioticAliceUrl}/policy`,
      { params }
    );

    return {
      id: new HRAC(fromHexString(resp.data.id)),
      ursulas: resp.data.ursulas,
      label: resp.data.label,
      policyKey: PublicKey.fromBytes(fromHexString(resp.data.policyKey)),
      aliceVerifyingKey: PublicKey.fromBytes(
        fromHexString(resp.data.aliceVerifyingKey)
      ),
      encryptedTreasureMap: new EncryptedTreasureMap(
        Capsule.fromBytes(
          fromHexString(resp.data.encryptedTreasureMap.capsule)
        ),
        fromHexString(resp.data.encryptedTreasureMap.cyphertext)
      ),
    };
  };

  return {
    getEncryptingKey,
    getVerifyingKey,
    getPolicyId,
    getPolicy,
  };
}

interface GetPolicyResponse {
  id: string;
  label: string;
  encryptedTreasureMap: {
    capsule: string;
    cyphertext: string;
  };
  policyKey: string;
  aliceVerifyingKey: string;
  ursulas: Ursula[];
}
