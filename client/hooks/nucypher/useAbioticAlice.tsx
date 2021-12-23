import { Bob, PublicKey } from "nucypher-ts";
import axios, { AxiosResponse } from "axios";
import { HRAC } from "nucypher-ts/build/main/src/policies/hrac";
import { Ursula } from "nucypher-ts/build/main/src/characters/porter";
import { fromHexString } from "utils";
import { Capsule } from "umbral-pre";
import { EncryptedTreasureMap } from "nucypher-ts/build/main/src/policies/collections";
import { hexlify, keccak256, solidityPack } from "ethers/lib/utils";

export function useAbioticAlice() {
  // useEffect(() => {
  //   if (abioticAlice) {
  //     setPublicKey(abioticAlice.verifyingKey);
  //     console.log(hexlify(abioticAlice.verifyingKey.toBytes()));
  //   }
  // }, [abioticAlice]);

  /**
   * Get Alice's verfying key
   * @returns Alice's verfiying key
   */
  const getVerifyingKey = async () => {
    return axios
      .get("http://localhost:3001/verifyingKey", {
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
      .get(`http://localhost:3001/encryptingKey?label=${label}`, {
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
      `http://localhost:3001/policy`,
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

    // return axios
    //   .get(`http://localhost:3001/policy?policyId=${policyId}`)
    //   .then((res) => {
    //     const _policy = res.data as EnactedPolicy;
    //     const key = _policy.policyKey.toBytes();
    //     console.log(JSON.stringify(key));
    //     // console.log(PublicKey.fromBytes(_policy.policyKey));

    //     // const policy: any = { ..._policy };
    //     // policy.id = new HRAC(Uint8Array.from(Object.values(_policy.id.bytes)));
    //     // policy.aliceVerifyingKey = Uint8Array.from(
    //     //   Object.values(_policy.aliceVerifyingKey)
    //     // );
    //     // policy.encryptedTreasureMap.ciphertext = Uint8Array.from(
    //     //   Object.values(_policy.encryptedTreasureMap.ciphertext)
    //     // );
    //     // policy.policyEncryptingKey = PublicKey.fromBytes(
    //     //   Uint8Array.from(Object.values(_policy.policyEncryptingKey))
    //     // );

    //     // console.log(policy);

    //     // return policy as EnactedPolicy;
    //   });
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
