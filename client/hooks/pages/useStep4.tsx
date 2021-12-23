import { hexlify } from "ethers/lib/utils";
import { useAbioticAlice } from "hooks/nucypher/useAbioticAlice";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { PublicKey } from "nucypher-ts";
import { EncryptedTreasureMap } from "nucypher-ts/build/main/src/policies/collections";
import { useEffect, useState } from "react";
import { fromBytes } from "utils";

export function useStep4() {
  const { metadata, nuUser, nuUserPolicyId } = useOpenDRM();
  const [image, setImage] = useState("");
  const { getPolicy } = useAbioticAlice();

  useEffect(() => {
    if (metadata) {
      setImage(hexlify(metadata.msgKit.ciphertext));
    }
  }, [metadata]);

  const decrypt = async () => {
    if (!nuUser) {
      alert("Please register Nu account");
      return;
    }
    if (!metadata || !nuUserPolicyId) {
      alert("Please encrypt metadata");
      return;
    }

    // get policy
    const policy = await getPolicy(nuUserPolicyId);
    console.log(policy);

    const res = await nuUser.retrieveAndDecrypt(
      policy.policyKey,
      policy.aliceVerifyingKey,
      [metadata.msgKit],
      policy.encryptedTreasureMap
    );

    console.log(fromBytes(res[0]))
  };

  return { image, decrypt };
}
