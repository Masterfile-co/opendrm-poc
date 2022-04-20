import { Web3Provider } from "@ethersproject/providers";
import { Bob } from "@nucypher/nucypher-ts";
import { useWeb3React } from "@web3-react/core";
import { useAppState } from "providers/OpenDRMProvider";
import {
  Step5DispatchContext,
  useStep5State,
} from "providers/pages/Step5Provider";
import { useContext } from "react";
import { OpenDRM721v2__factory } from "types";
import { bobFromSecret, fromBytes } from "utils";
import { bobAddress, odrm721Address } from "utils/config";
import { useDKG } from "../useDKG";
import { useOpenDRM } from "../useOpenDRM";

export function useStep5() {
  const dispatch = useContext(Step5DispatchContext);
  const { provider, account, chainId } = useWeb3React();

  const { steps, loading, bobCleartext } = useStep5State();
  const { steps: appSteps, tokenId, metadata, policy } = useAppState();

  const { getPolicyId, listenForPolicy, getLabel } = useDKG();
  const { setStepDone } = useOpenDRM();

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: { loading } });
  };

  const setStep5StepDone = (step: number) => {
    dispatch({ type: "SET_STEP_DONE", payload: { step } });
  };

  const setBobCleartext = (bobCleartext: string) => {
    dispatch({ type: "SET_BOB_CLEARTEXT", payload: { bobCleartext } });
  };

  const transferToken = async () => {
    if (!account || !provider) {
      alert("Please connect wallet");
      return;
    }

    setLoading(true);

    const odrm721 = OpenDRM721v2__factory.connect(
      odrm721Address,
      (provider as Web3Provider).getSigner()
    );

    odrm721["safeTransferFrom(address,address,uint256)"](
      account,
      bobAddress,
      tokenId
    )
      .then((tx) => tx.wait())
      .then((res) => {
        setLoading(false);
        setStep5StepDone(0);
      })
      .catch((err) => {
        console.log({ err });
        alert(`Error: ${err.message}`);
        setLoading(false);
      });
  };

  const decryptAsBob = async () => {
    if (!metadata || !policy) {
      alert("Please mint a new OpenDRM NFT");
      return;
    }

    if (!account || !chainId) {
      alert("Please connect wallet");
      return;
    }

    setLoading(true);

    const bob = bobFromSecret("dumbkey");
    const label = getLabel(odrm721Address, chainId, tokenId);
    const policyId = await getPolicyId(label, bob);

    try {
      const policy = await listenForPolicy(policyId);

      const res = await bob.retrieveAndDecrypt(
        policy.policyEncryptingKey,
        policy.publisherVerifyingKey,
        [metadata.msgKit],
        policy.encryptedTreasureMap
      );

      setBobCleartext(fromBytes(res[0]));
      setStep5StepDone(1);
      setStepDone(4);
    } catch (err) {
      alert("Policy not found. Try again");
    }
    setLoading(false);
  };

  return {
    steps,
    loading,
    active: appSteps[4].active,
    transferToken,
    decryptAsBob,
    bobCleartext,
    metadata,
  };
}
