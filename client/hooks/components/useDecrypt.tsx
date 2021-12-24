import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { Bob } from "nucypher-ts";
import { Metadata } from "providers/OpenDRMContextProvider";
import { useState } from "react";
import { NuConfig } from "utils/constants";
import { useDecryptMetadata } from "./useDecryptMetadata";

export interface DecryptHook {
  nuUser: Bob | undefined;
  metadata: Metadata | undefined;
  nuUserPolicyId: string | undefined;
  label: string | undefined
}

export function useDecrypt(props: DecryptHook) {
  const { metadata, nuUserPolicyId, label, nuUser } = props;
  const [bobCleartext, setBobCleartext] = useState<string | undefined>();
  const { decryptMetadata } = useDecryptMetadata();
  const { getPolicyId } = useAbioticAlice();

  const decryptAsYou = async () => {
    if (!nuUser) {
      alert("Please register Nu account");
      return;
    }
    if (!metadata || !nuUserPolicyId) {
      alert("Please encrypt metadata");
      return;
    }

    decryptMetadata(nuUser, nuUserPolicyId, metadata).catch((err) => {
      console.log(err);
    });
  };
  const decryptAsBob = async () => {
    if (!metadata || !label) {
      alert("Please transfer NFT to bob");
      return;
    }

    const bob = Bob.fromSecretKey(
      NuConfig,
      Buffer.from("fake-secret-key-32-bytes-bob-xxx")
    );

    const policyId = await getPolicyId(label, bob);

    const cleartext = await decryptMetadata(bob, policyId, metadata);
    setBobCleartext(cleartext);
  };

  return { decryptAsBob, decryptAsYou, bobCleartext };
}
