import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import type { NextComponentType } from "next";
import Layout from "../components/layout/Layout";
import OpenDRMProvider from "../providers/OpenDRMProvider";


const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  return (
    <OpenDRMProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </OpenDRMProvider>
  );
};

export default MyApp;
