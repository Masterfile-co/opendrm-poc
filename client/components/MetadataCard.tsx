import { Metadata } from "hooks/components/useMetadata";
import React from "react";

interface IMetadataCard {
  metadata: Metadata;
}

export default function MetadataCard(props: IMetadataCard) {
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="flex max-w-lg">
        <pre className="h-full whitespace-pre-wrap break-all overflow-ellipsis">
          {JSON.stringify(props.metadata, null, "\t")}
        </pre>
      </div>
    </div>
  );
}
