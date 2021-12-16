import { createContext, useContext, useEffect, useState } from "react";
import {
  Alice,
  BlockchainPolicyParameters,
  Bob,
  EnactedPolicy,
  PublicKey,
} from "nucypher-ts";
import { Web3Provider } from "@ethersproject/providers";
import { hexlify } from "ethers/lib/utils";
import { AbioticAliceManager__factory } from "types";
import axios from "axios";
import sha3 from "js-sha3";
import { utils } from "ethers";
import { HRAC } from "nucypher-ts/build/main/src/policies/hrac";

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
    const bobVerifyingKey = utils.hexlify(bob.verifyingKey.toBytes());

    return axios
      .get(
        `http://localhost:3001/policyId?label=${label}&verifyingKey=${bobVerifyingKey}`
      )
      .then((res) => {
        return res.data.policyId;
      });

    // return res.data.policyId;
  };

  const getPolicy = async (policyId: string) => {
    return axios
      .get(`http://localhost:3001/policy?policyId=${policyId}`)
      .then((res) => {
        const policy = res.data as EnactedPolicy;
        return policy;
      });
  };

  return {
    getEncryptingKey,
    getVerifyingKey,
    getPolicyId,
    getPolicy,
  };
}
