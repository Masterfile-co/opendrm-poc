import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import OpenDRMInitializer from "./NetworkInitializer";
import dynamic from "next/dynamic";
import { getLibrary } from "utils/connectors";
import NetworkInitalizer from "./NetworkInitializer";

const NetworkProvider = dynamic(() => import("./NetworkProvider"), {
  ssr: false,
});

export default function OpenDRMProvider({ children }: { children: any }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProvider getLibrary={getLibrary}>
        <NetworkInitalizer>{children}</NetworkInitalizer>
      </NetworkProvider>
    </Web3ReactProvider>
  );
}
