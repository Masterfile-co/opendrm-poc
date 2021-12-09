import React, { useState } from "react";

export type Metadata = {
  name: string;
  description: string;
  image: string;
  encryptingKey: string;
};

export function useMetadata() {
  const [metadata, dispatchMetadata] = useState<Metadata>({
    name: "OpenDRM POC",
    description: "A proof of concept OpenDRM demo",
    image: "",
    encryptingKey: "",
  });

  const setMetadata = (metadata: Metadata) => {
    dispatchMetadata(metadata);
  };

  return {
    metadata,
    setMetadata,
  };
}
