import { Web3Provider } from "@ethersproject/providers";
import { Enrico, MessageKit, PublicKey } from "@nucypher/nucypher-ts";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { AppDispatchContext, useAppState } from "providers/OpenDRMProvider";
import {
  Step3DispatchContext,
  useStep3State,
} from "providers/pages/Step3Provider";
import { useContext } from "react";
import { OpenDRM721v2__factory } from "types";
import { bobFromSecret, delay } from "utils";
import { MINT_COST, odrm721Address } from "utils/config";
import { Metadata } from "utils/types";
import { useDKG } from "./useDKG";
import { useOpenDRM } from "./useOpenDRM";

export function useStep3() {
  const dispatch = useContext(Step3DispatchContext);
  const dispatchApp = useContext(AppDispatchContext);

  const { steps, cleartext, loading } = useStep3State();
  const { steps: appSteps, tokenId, secret } = useAppState();

  const { chainId, provider } = useWeb3React();

  const { getEncryptingKey, getLabel, getPolicyId, getPolicy } = useDKG();
  const { setMetadata, setPolicy, setStepDone } = useOpenDRM();
  const { push } = useRouter();

  const setCleartext = (cleartext: string) => {
    dispatch({ type: "SET_CLEARTEXT", payload: { cleartext } });
  };

  const setStep3StepDone = (step: number) => {
    dispatch({ type: "SET_STEP_DONE", payload: { step } });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: { loading } });
  };

  const encryptMetadata = async () => {
    if (!chainId) {
      alert("Please connect wallet");
      return;
    }

    const label = getLabel(odrm721Address, chainId, tokenId);

    const encryptingKey = await getEncryptingKey(label);

    const msgKit = encryptMessage(encryptingKey, cleartext);

    const metadata: Metadata = {
      title: "OpenDRM Demo",
      description: "An OpenDRM prototype demonstration",
      msgKit,
    };

    setMetadata(metadata);

    setStep3StepDone(0);
  };

  const encryptMessage = (
    encryptingKey: PublicKey,
    cleartext: string
  ): MessageKit => {
    const enrico = new Enrico(encryptingKey);
    return enrico.encryptMessage(cleartext);
  };

  const mintToken = async () => {
    if (!provider) {
      alert("Please connect wallet");
      return;
    }
    setLoading(true);

    const odrm721 = OpenDRM721v2__factory.connect(
      odrm721Address,
      (provider as Web3Provider).getSigner()
    );

    return odrm721
      .mint(tokenId, { value: MINT_COST })
      .then((tx) => tx.wait())
      .then((res) => {
        setLoading(false);
        setStep3StepDone(1);
        listenForPolicy();
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
        setLoading(false);
      });
  };

  const listenForPolicy = async () => {
    let attemptCount = 0;
    const bob = bobFromSecret(secret!);
    const label = getLabel(odrm721Address, chainId!, tokenId);
    const policyId = await getPolicyId(label, bob);

    await delay(3);

    while (attemptCount < 5) {
      try {
        const policy = await getPolicy(policyId);
        console.log({ policy });
        setPolicy(policy);
        setStepDone(2);
        push("/step4");
        break;
      } catch (err) {
        console.log({ err });
        attemptCount++;
        await delay(1);
      }
    }

    if (attemptCount === 5) {
      alert("Policy not found. Try again");
    }
  };

  return {
    cleartext,
    setCleartext,
    setStep3StepDone,
    encryptMetadata,
    loading,
    setLoading,
    mintToken,
    steps,
    tokenId,
    active: appSteps[2].active,
  };
}
