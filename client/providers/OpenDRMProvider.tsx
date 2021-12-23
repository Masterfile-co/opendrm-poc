import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import dynamic from "next/dynamic";
import { getLibrary } from "utils/connectors";
import {
  OpenDRMContextProvider,
} from "./OpenDRMContextProvider";

const NetworkProvider = dynamic(() => import("./NetworkProvider"), {
  ssr: false,
});

export default function OpenDRMProvider({ children }: { children: any }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProvider getLibrary={getLibrary}>
        <OpenDRMContextProvider>{children}</OpenDRMContextProvider>
      </NetworkProvider>
    </Web3ReactProvider>
  );
}
