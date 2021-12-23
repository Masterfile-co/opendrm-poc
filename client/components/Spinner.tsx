import React from "react";
import Image, { ImageProps } from "next/image";

export default function Spinner(props: Partial<ImageProps>) {
  return (
    <Image
      src="/loading.png"
      alt="Masterfile Logo"
      className="animate-spin duration-10000"
      layout="responsive"
      height={88}
      width={88}
    />
  );
}