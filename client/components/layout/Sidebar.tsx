import React from "react";
import Image from "next/image";
import VerticleSteps from "./VerticleSteps";
import MetadataField from "./MetadataField";
import { useOpenDRM } from "hooks/provider/useOpenDRM";

export default function Sidebar() {

  return (
    <div className="flex flex-col bg-sidebar items-center">
      <div className="mx-[30px] mt-[33px] w-[300px]">
        <Image
          src="/2021_Branding_Masterfile-Logos-2-03 3.png"
          width={300}
          height={66}
          layout="responsive"
          alt="masterfile logo"
        />
      </div>
      <VerticleSteps />
      <MetadataField />
    </div>
  );
}
