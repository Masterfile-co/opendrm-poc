import { hexlify } from "ethers/lib/utils";
import { useDecryptMetadata } from "hooks/components/useDecryptMetadata";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useStep4() {
  const { metadata, nuUser, nuUserPolicyId, setStepDone, steps } = useOpenDRM();
  const [image, setImage] = useState("");
  const [cleartext, setCleartext] = useState<string | undefined>(undefined);
  const { decryptMetadata } = useDecryptMetadata();
  const { push } = useRouter();

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

    const cleartext = await decryptMetadata(nuUser, nuUserPolicyId, metadata);
    setCleartext(cleartext);
    setStepDone(3);
  };

  const incPage = () => {
    push("/step5");
  };

  return {
    image,
    decrypt,
    cleartext,
    incPage,
    nuUserPolicyId,
    active: steps[3].active,
  };
}
