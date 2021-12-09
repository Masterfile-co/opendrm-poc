import { useOpenDRM } from "hooks/useOpenDRM";
import React from "react";
import EncryptData from "./EncryptData";
import Metadata from "./MetadataCard";

export default function Demo() {
  const { encryptDataProps, encryptCleartext, metadataProps, grantPolicy, deriveId } =
    useOpenDRM();
  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        <Metadata metadata={metadataProps.metadata} />
        <EncryptData
          {...encryptDataProps}
          encryptCleartext={encryptCleartext}
          grantPolicy={grantPolicy}
          deriveId={deriveId}
        />
      </div>
    </div>
  );
}
