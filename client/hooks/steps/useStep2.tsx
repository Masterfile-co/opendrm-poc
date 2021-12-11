import { JsonRpcSigner } from "@ethersproject/providers";
import { sign } from "crypto";
import { utils } from "ethers";
import { Bob } from "nucypher-ts";
import { useEffect, useState } from "react";
import { AbioticAliceManager__factory } from "types";
import { ABIOTICALICE_ADDRESS, NuConfig } from "utils/constants";

const { toUtf8Bytes, zeroPad, hexlify } = utils;

interface Step2 {
  signer: JsonRpcSigner | null;
}

export function useStep2({ signer }: Step2) {
  const [done, setDone] = useState(false);

  const registerUser = async (secretKey: string) => {
    if (!signer) {
      alert("Please connect wallet");
      return;
    }
    localStorage.setItem("nu_sk", secretKey);

    const bob = Bob.fromSecretKey(
      NuConfig,
      zeroPad(toUtf8Bytes(secretKey), 32)
    );

    const aliceManager = AbioticAliceManager__factory.connect(
      ABIOTICALICE_ADDRESS,
      signer
    );

    const tx = await aliceManager.registerMe(
      bob.verifyingKey.toBytes(),
      bob.decryptingKey.toBytes()
    );
    await tx.wait();

    setDone(true);
  };

  // Check to see if use has stored secretkey and matches registry
  const initUser = async () => {
    const secretKey = localStorage.getItem("nu_sk");

    if (!secretKey) {
      return;
    }

    const bob = Bob.fromSecretKey(
      NuConfig,
      zeroPad(toUtf8Bytes(secretKey), 32)
    );

    if (!signer) {
      return;
    }

    const aliceManager = AbioticAliceManager__factory.connect(
      ABIOTICALICE_ADDRESS,
      signer
    );

    const registeredKey = await aliceManager.registry(
      await signer.getAddress()
    );

    if (registeredKey.bobVerifyingKey === hexlify(bob.verifyingKey.toBytes())) {
      setDone(true);
    } else {
      localStorage.removeItem("nu_sk");
    }
  };

  useEffect(() => {
    if (signer) {
      initUser();
    }
  }, [signer]);

  return { done, registerUser };
}
