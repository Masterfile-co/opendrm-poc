import { PrimaryButton } from "components/Button";

import EncryptData from "components/EncryptData";
import type { NextPage } from "next";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ConnectorNames } from "utils/connectors";

import Image from "next/image";
import Link from "next/link";

const Home: NextLayoutComponentType = () => {
  const { push } = useRouter();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center w-full h-full space-y-10 px-5 pb-5">
      <div className="flex flex-col h-full justify-center items-center">
        <span className="text-3xl max-w-[500px] text-center font-semibold mb-4">
          Welcome to the OpenDRM demo by Masterfile. Get started minting
          encrypted NFTs.
        </span>
        <span className=" text-[#Cf54AB] text-center font-semibold mb-8">
          Works best on desktop. Just a demo, please be gentle!
        </span>
        <PrimaryButton
          className="mb-10"
          onClick={() => {
            push("step1");
          }}
        >
          Get Started
        </PrimaryButton>
        <div className=" justify-between w-[300px] items-center flex relative ">
          <div className="block h-16 w-16">
            <a
              href={"https://masterfile.co"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/Masterfile-Logo-Circle.png"}
                layout="responsive"
                objectFit="cover"
                height={120}
                width={120}
                className="hover:cursor-pointer"
              />
            </a>
          </div>
          <div className="block h-16 w-16">
            <a
              href={"https://github.com/Masterfile-co/opendrm-poc"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/github-white.png"}
                layout="responsive"
                objectFit="cover"
                height={120}
                width={120}
                className="hover:cursor-pointer"
              />
            </a>
          </div>
          <div className="block h-16 w-16">
            <a
              href={"https://threshold.network/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/threshold.png"}
                layout="responsive"
                objectFit="cover"
                height={120}
                width={120}
                className="hover:cursor-pointer"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

Home.getInitialProps = () => {
  return {};
};

export default Home;
