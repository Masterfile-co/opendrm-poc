import { hexlify } from "ethers/lib/utils";
import { Bob } from "nucypher-ts";
import { useState } from "react";
import { NuConfig } from "utils/constants";
interface IBob {
  secretKey: string;
}

export function useBob(props: IBob) {
  const [bob, setBob] = useState(
    Bob.fromSecretKey(NuConfig, Buffer.from(props.secretKey))
  );

  return {
    decryptingKey: bob.decryptingKey,
    verifyingKey: bob.verifyingKey,
  };
}