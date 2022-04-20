import { hexlify } from "ethers/lib/utils";

import { Metadata } from "providers/OpenDRMContextProvider";
import { useAppState } from "providers/OpenDRMProvider";
import React from "react";
import { middleEllipsis } from "utils";

export default function MetadataField() {
  const { metadata } = useAppState();

  return (
    <div className=" mb-0 p-[15px] w-full">
      <div className="bg-[#1B1B1D] w-full max-w-[320px] overflow-hidden min-h-[190px] rounded-sm text-white text-xs p-2 border border-[#313133]">
        <span className="text-white text-sm font-bold font-secondary">
          NFT Metadata:
        </span>
        <pre className="h-full whitespace-pre-wrap overflow-ellipsis text-white leading-4 text-[12px]">
          {metadata &&
            JSON.stringify(
              {
                title: metadata.title,
                description: metadata.description,
                image: middleEllipsis(hexlify(metadata.msgKit.toBytes())),
                capsule: middleEllipsis(hexlify(metadata.msgKit.capsule.toBytes())),
              },
              null,
              "\t"
            )}
        </pre>
      </div>
    </div>
  );
}
