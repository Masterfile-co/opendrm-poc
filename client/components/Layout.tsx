import React from "react";
import Head from "next/head";

export default function Layout(props: React.HTMLAttributes<HTMLBodyElement>) {
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
      <main>{props.children}</main>
    </>
  );
}
