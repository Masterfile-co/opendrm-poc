import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { hexlify, toUtf8Bytes, zeroPad } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { Bob } from "@nucypher/nucypher-ts";
import {
  Metadata,
  OpenDRMContext,
  OpenDRMManagerState,
} from "providers/OpenDRMContextProvider";
import { useCallback, useEffect, useReducer } from "react";
import { AbioticAliceManager__factory } from "types";
import { ABIOTICALICE_ADDRESS, NuConfig } from "utils/constants";

enum ActionType {
  UPDATE,
}

interface Action {
  type: ActionType;
  payload: Partial<OpenDRMManagerState>;
}

const reducer = (
  state: OpenDRMManagerState,
  { type, payload }: Action
): OpenDRMManagerState => {
  switch (type) {
    case ActionType.UPDATE: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};

export function useOpenDRMContextManager(): OpenDRMContext {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { steps, metadata, loading } = state;
  const { push } = useRouter();
  const { account } = useWeb3React();
  // user eager connect


  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: ActionType.UPDATE, payload: { loading } });
  }, []);

  // const init = useCallback(async () => {
    
  //   if ( !account) {
  //     push("/");
  //     setLoading(false);
  //     return;
  //   }
  //   // Active so past step1
  //   setStepDone(0);

  //   // Check if valid registration
  //   const secretKey = localStorage.getItem("nu_sk");

  //   if (!secretKey) {
  //     // push("/step2");
  //     setLoading(false);
  //     return;
  //   }
  //   const bob = Bob.fromSecretKey(
  //     NuConfig,
  //     zeroPad(toUtf8Bytes(secretKey), 32)
  //   );
  //   const aliceManager = AbioticAliceManager__factory.connect(
  //     ABIOTICALICE_ADDRESS,
  //     library.getSigner()
  //   );

  //   const registeredKey = await aliceManager.registry(account);

  //   if (registeredKey.bobVerifyingKey === hexlify(bob.verifyingKey.toBytes())) {
  //     setNuUser(bob);
  //     setStepDone(1);
  //     // push("/step3");
  //     setLoading(false);
  //   } else {
  //     localStorage.removeItem("nu_sk");
  //     // push("/step2");
  //     setLoading(false);
  //   }
  // }, [active, steps]);

  const setMetadata = useCallback((metadata: Metadata) => {
    dispatch({ type: ActionType.UPDATE, payload: { metadata } });
  }, []);

  const setNuUserPolicyId = useCallback((policyId: string) => {
    dispatch({
      type: ActionType.UPDATE,
      payload: { nuUserPolicyId: policyId },
    });
  }, []);

  const setBobPolicyId = useCallback((policyId: string) => {
    dispatch({
      type: ActionType.UPDATE,
      payload: { bobPolicyId: policyId },
    });
  }, []);

  /**
   * Sets stepIndex as done and sets next step as active
   */
  const setStepDone = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= state.steps.length) {
        throw new Error("Invalid step");
      }

      const _steps = [...state.steps];
      for (var i = 0; i <= stepIndex; i++) {
        _steps[i].done = true;
        _steps[i].active = false;
      }
      if (stepIndex < _steps.length - 1) {
        _steps[stepIndex + 1].active = true;
      }
      dispatch({ type: ActionType.UPDATE, payload: { steps: _steps } });
    },
    [steps]
  );

  const setMinorStepDone = useCallback(
    (stepIndex: number, minorStepIndex: number) => {
      if (stepIndex >= state.steps.length) {
        throw new Error("Invalid step");
      }

      const step = { ...state.steps[stepIndex] };
      if (!step.minorSteps || minorStepIndex > step.minorSteps.length) {
        throw new Error("Invalid minor step");
      }
      for (var i = 0; i <= minorStepIndex; i++) {
        step.minorSteps[i].done = true;
        step.minorSteps[i].active = false;
      }
      if (minorStepIndex < step.minorSteps.length - 1) {
        step.minorSteps[i].active = true;
      }
      const _steps = [...state.steps];
      _steps[stepIndex] = step;
      dispatch({ type: ActionType.UPDATE, payload: { steps: _steps } });
    },
    [steps]
  );

  const setNuUser = useCallback((user: Bob) => {
    dispatch({ type: ActionType.UPDATE, payload: { nuUser: user } });
  }, []);

  const setLabel = useCallback((label: string) => {
    dispatch({ type: ActionType.UPDATE, payload: { label } });
  }, []);

  return {
    ...state,
    setMetadata,
    setStepDone,
    setMinorStepDone,
    setNuUser,
    setNuUserPolicyId,
    setBobPolicyId,
    setLabel,
  };
}

const initialState: OpenDRMManagerState = {
  loading: true,
  tokenId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  steps: [
    {
      label: "1",
      title: "Connect Wallet",
      done: false,
      active: true,
    },
    {
      label: "2",
      title: "Register Nu Wallet",
      done: false,
      active: false,
    },
    {
      label: "3",
      title: "Encrypt and Mint",
      done: false,
      active: false,
      minorSteps: [
        { label: "A", title: "Encrypt", done: false, active: true },
        { label: "B", title: "Mint", done: false, active: false },
        { label: "C", title: "Policy", done: false, active: false },
      ],
    },
    {
      label: "4",
      title: "Decrypt NFT",
      done: false,
      active: false,
    },
    {
      label: "5",
      title: "Transfer NFT",
      done: false,
      active: false,
      minorSteps: [
        { label: "A", title: "Transfer", done: false, active: true },
        { label: "B", title: "Policy", done: false, active: false },
        { label: "C", title: "Decrypt", done: false, active: false },
      ],
    },
  ],
};
