import React from "react";

export interface DescriptionBox {
  description: any;
}

export default function DescriptionBox({ description }: DescriptionBox) {
  return (
    <div className="flex w-full justify-center items-center min-h-[180px] border border-[#313133] px-12 text-sm text-[#6B7280]">
      <span className="text-center">{description}</span>
    </div>
  );
}
