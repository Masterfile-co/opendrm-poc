import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import type { NextComponentType } from "next";
import Layout from "../components/layout/Layout";

import Web3Provider from "../providers/Web3Provider";
import { OpenDRMProvider } from "providers/OpenDRMProvider";
import OpenDRMManager from "providers/OpenDRMManager";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  return (
    <Web3Provider>
      <OpenDRMProvider>
        <OpenDRMManager />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </OpenDRMProvider>
    </Web3Provider>
  );
};

MyApp.getInitialProps = (context: AppContext) => {
  return { pageProps: null };
};

export default MyApp;
