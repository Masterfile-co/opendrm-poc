import React from "react";
import Image from "next/image";
import Spinner from "../Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-14 bg-[#1b1b1d]">
      <Image
        src="/2021_Branding_Masterfile-Logos-2-03 3.png"
        alt="Masterfile Logo"
        width={300}
        height={66}
      />
      <div className="h-[50px] w-[50px]">
        <Spinner />
      </div>
    </div>
  );
}
