import React from "react";

export default function Content({ children }: { children: any }) {
  return (
    <div className="flex w-full min-h-screen h-full bg-[#1b1b1d] text-white">
      {children}
    </div>
  );
}
