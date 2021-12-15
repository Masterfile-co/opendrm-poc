import { createContext, useContext, useEffect, useState } from "react";
import { Alice, BlockchainPolicyParameters, PublicKey } from "nucypher-ts";
import { Web3Provider } from "@ethersproject/providers";
import { hexlify } from "ethers/lib/utils";
import { AbioticAliceManager__factory } from "types";
import axios from "axios";

export function useAbioticAlice() {
  // useEffect(() => {
  //   if (abioticAlice) {
  //     setPublicKey(abioticAlice.verifyingKey);
  //     console.log(hexlify(abioticAlice.verifyingKey.toBytes()));
  //   }
  // }, [abioticAlice]);

  const getVerifyingKey = async () => {
    return axios
      .get("http://localhost:3001/verifyingKey", {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        return PublicKey.fromBytes(new Uint8Array(data));
      });
  };

  const getEncryptingKey = async (label: string) => {
    return axios
      .get(`http://localhost:3001/encryptingKey?label=${label}`, {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        return PublicKey.fromBytes(new Uint8Array(data));
      });
  };

  const getPolicy = async () => {};

  return {
    getEncryptingKey,
    getVerifyingKey,
  };
}

export interface AbioticAliceProps {
  abioticAlice: Alice | undefined;
  setAbioticAlice: (provider: Web3Provider) => void;
}

export const AbioticAliceContext = createContext<AbioticAliceProps>({
  abioticAlice: undefined,
  setAbioticAlice: () => {},
});
