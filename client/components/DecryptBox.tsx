import React from "react";

export default function DecryptBox({ children }: { children?: string }) {
  return (
    <div className="bg-[#313133] w-full max-w-[360px] overflow-hidden min-h-[190px] rounded-sm text-white text-xs p-4 flex justify-center items-center">
      <span className="text-white text-center text-sm font-bold font-secondary whitespace-pre-wrap break-all">
        {children}
      </span>
    </div>
  );
}
