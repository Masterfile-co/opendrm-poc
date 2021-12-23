import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { toUtf8Bytes, zeroPad } from "ethers/lib/utils";
import { useOpenDRM } from "hooks/provider/useOpenDRM";
import { useRouter } from "next/router";
import { Bob } from "nucypher-ts";
import { useState } from "react";
import { AbioticAliceManager__factory } from "types";
import { ABIOTICALICE_ADDRESS, NuConfig } from "utils/constants";

export function useStep2() {
  const { push } = useRouter();
  const { setStepDone, setNuUser, steps } = useOpenDRM();
  const { library } = useWeb3React<Web3Provider>();
  const [secretKey, dispatchSecretKey] = useState<string | undefined>(
    undefined
  );

  const setSecretKey = (secretKey: string) => {
    dispatchSecretKey(secretKey);
  };

  const registerUser = async () => {
    if (!library) {
      alert("Please connect wallet");
      return;
    }
    if (!secretKey) {
      alert("Please enter secret key");
      return;
    }

    const bob = Bob.fromSecretKey(
      NuConfig,
      zeroPad(toUtf8Bytes(secretKey), 32)
    );
    const aliceManager = AbioticAliceManager__factory.connect(
      ABIOTICALICE_ADDRESS,
      library.getSigner()
    );

    // TODO: Error handling
    const tx = await aliceManager.registerMe(
      bob.verifyingKey.toBytes(),
      bob.decryptingKey.toBytes()
    );
    await tx.wait();

    localStorage.setItem("nu_sk", secretKey);
    setNuUser(bob);
    setStepDone(1);
    push("/step3");
  };

  return {
    secretKey,
    setSecretKey,
    registerUser,
    done: steps[1].done,
    active: steps[1].active,
  };
}
