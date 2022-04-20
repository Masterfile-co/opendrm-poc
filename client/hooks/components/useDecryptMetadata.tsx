import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { Bob } from "nucypher-ts";
import { Metadata } from "providers/OpenDRMContextProvider";
import { fromBytes } from "utils";


export function useDecryptMetadata() {
  const { getPolicy } = useAbioticAlice();

  const decryptMetadata = async (user: Bob, policyId: string, metadata: Metadata) => {
    const policy = await getPolicy(policyId);

    const res = await user.retrieveAndDecrypt(
      policy.policyKey,
      policy.aliceVerifyingKey,
      [metadata.msgKit],
      policy.encryptedTreasureMap
    );

    return fromBytes(res[0]);
  };

  return { decryptMetadata };
}
