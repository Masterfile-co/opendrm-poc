import React from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Loading from "./Loading";
import { useOpenDRM } from "hooks/provider/useOpenDRM";

export default function Layout(props: React.HTMLAttributes<HTMLBodyElement>) {
  const { loading } = useOpenDRM();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>OpenDRM POC</title>
        <meta
          name="description"
          content="Proof of concept for Masterfile's OpenDRM"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-auto min-h-screen w-screen font-primary">
        <Sidebar />
        <main className="w-full h-full ">
          <Content>{props.children}</Content>
        </main>
      </div>
    </>
  );
}
