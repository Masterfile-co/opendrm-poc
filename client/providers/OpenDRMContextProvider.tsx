import { useOpenDRMContextManager } from "hooks/provider/useOpenDRMContextManager";
import { Bob, MessageKit } from "nucypher-ts";
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
  setNuUser: (user: Bob) => {
    throw new Error("Not Initialized");
  },
  steps: [],
  loading: true,
  tokenId: 0
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

export interface OpenDRMManagerState {
  steps: Step[];
  nuUser?: Bob;
  metadata?: Metadata;
  loading: boolean;
  tokenId: number;
}

export interface OpenDRMContext extends OpenDRMManagerState {
  setMetadata: (metadata: Metadata) => void;
  setStepDone: (stepIndex: number) => void;
  setNuUser: (user: Bob) => void;
}
