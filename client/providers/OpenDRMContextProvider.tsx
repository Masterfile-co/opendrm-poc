import { useOpenDRMContextManager } from "hooks/provider/useOpenDRMContextManager";
import { Bob, MessageKit } from "@nucypher/nucypher-ts";
import React, { createContext } from "react";

export function OpenDRMContextProvider({ children }: { children: any }) {
  const state = useOpenDRMContextManager();

  return (
    <OpenDRMContext.Provider value={state}>{children}</OpenDRMContext.Provider>
  );
}

export const OpenDRMContext = createContext<OpenDRMContext>({
  setMetadata: (metadata: Metadata) => {
    throw new Error("Not Initialized");
  },
  setStepDone: (stepIndex: number) => {
    throw new Error("Not Initialized");
  },
  setMinorStepDone: (stepIndex: number, minorStepIndex) => {
    throw new Error("Not Initialized");
  },
  setNuUser: (user: Bob) => {
    throw new Error("Not Initialized");
  },
  setNuUserPolicyId: (policyId: string) => {
    throw new Error("Not Initialized");
  },
  setLabel: (label: string) => {
    throw new Error("Not Initialized");
  },
  setBobPolicyId: (policyId: string) => {
    throw new Error("Not Initialized");
  },
  steps: [],
  loading: true,
  tokenId: 0,
});

export interface Metadata {
  title: string;
  description: string;
  msgKit: MessageKit;
}

export interface Step {
  label: string;
  title: string;
  done: boolean;
  active: boolean;
}

export interface MajorStep extends Step {
  minorSteps?: Step[];
}

export interface OpenDRMManagerState {
  steps: MajorStep[];
  nuUser?: Bob;
  metadata?: Metadata;
  loading: boolean;
  tokenId: number;
  label?: string;
  nuUserPolicyId?: string;
  bobPolicyId?: string;
}

export interface OpenDRMContext extends OpenDRMManagerState {
  setMetadata: (metadata: Metadata) => void;
  setStepDone: (stepIndex: number) => void;
  setMinorStepDone: (stepIndex: number, minorStepIndex: number) => void;
  setNuUser: (user: Bob) => void;
  setNuUserPolicyId: (policyId: string) => void;
  setBobPolicyId: (policyId: string) => void;
  setLabel: (label: string) => void;
}
