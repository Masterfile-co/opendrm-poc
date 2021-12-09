import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import OpenDRMInitializer from "./OpenDRMInitializer";
import dynamic from "next/dynamic";
import { getLibrary } from "utils/connectors";

const AbioticAliceWeb3Provider = dynamic(
  () => import("./AbioticAliceWeb3Provider"),
  { ssr: false }
);

export default function OpenDRMProvider({ children }: { children: any }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AbioticAliceWeb3Provider getLibrary={getLibrary}>
        <OpenDRMInitializer>{children}</OpenDRMInitializer>
      </AbioticAliceWeb3Provider>
    </Web3ReactProvider>
  );
}
