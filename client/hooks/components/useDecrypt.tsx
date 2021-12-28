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
  bob: Bob;
  bobPolicyId: string | undefined;
  setLocalStepDone: (stepIndex: number) => void;
  setStepDone: (stepIndex: number) => void;
}

export function useDecrypt(props: DecryptHook) {
  const {
    metadata,
    nuUserPolicyId,
    nuUser,
    bob,
    bobPolicyId,
    setLocalStepDone,
    setStepDone,
  } = props;
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
    if (!metadata || !bobPolicyId) {
      alert("Please transfer NFT to bob");
      return;
    }

    const cleartext = await decryptMetadata(bob, bobPolicyId, metadata);
    setBobCleartext(cleartext);
    setLocalStepDone(2);
    setStepDone(4);
  };

  return { decryptAsBob, decryptAsYou, bobCleartext };
}
