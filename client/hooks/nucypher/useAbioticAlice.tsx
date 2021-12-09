import { createContext, useContext, useEffect, useState } from "react";
import { Alice, BlockchainPolicyParameters, PublicKey } from "nucypher-ts";
import { Web3Provider } from "@ethersproject/providers";
import { hexlify } from "ethers/lib/utils";

export function useAbioticAlice() {
  const { abioticAlice } = useContext(AbioticAliceContext);
  const [publicKey, setPublicKey] = useState<PublicKey | undefined>(undefined);

  useEffect(() => {
    if (abioticAlice) {
      setPublicKey(abioticAlice.verifyingKey);
      console.log(hexlify(abioticAlice.verifyingKey.toBytes()));
    }
  }, [abioticAlice]);

  /**
   * Request Alice to create a policy
   * @param policyParams
   * @param includeUrsulas
   * @param excludeUrsulas
   * @returns policyId
   */
  const requestPolicy = async (
    policyParams: BlockchainPolicyParameters,
    includeUrsulas?: string[],
    excludeUrsulas?: string[]
  ) => {
    if (!abioticAlice) {
      throw "Abiotic Alice not initiated";
    }

    return await abioticAlice.generatePolicy(
      policyParams,
      includeUrsulas,
      excludeUrsulas
    );
  };

  const grantPolicy = async (
    policyParams: BlockchainPolicyParameters,
    includeUrsulas?: string[],
    excludeUrsulas?: string[]
  ) => {
    if (!abioticAlice) {
      throw "Abiotic Alice not initiated";
    }
    return await abioticAlice.grant(
      policyParams,
      includeUrsulas,
      excludeUrsulas
    );
  };

  // const requestRevoke = async (policyId: Uint8Array) => {
  //   if (!abioticAlice) {
  //     throw "Abiotic Alice not initiated";
  //   }

  //   await abioticAlice.revoke(policyId);
  // };

  const requestEncryptingKey = (label: string) => {
    if (!abioticAlice) {
      throw "Abiotic Alice not initiated";
    }

    return abioticAlice.getPolicyEncryptingKeyFromLabel(label);
  };

  return {
    publicKey,
    requestPolicy,
    grantPolicy,
    requestEncryptingKey,
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
