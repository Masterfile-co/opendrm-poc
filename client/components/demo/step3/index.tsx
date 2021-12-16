import { PrimaryButton } from "components/Button";
import StepCard from "components/StepCard";
import React, { useState } from "react";

interface Step3 {
  done: boolean;
  encryptAndMint: (cleartext: string) => void;
  tokenId: number;
  setTokenId: (tokenId: number) => void;
}

export default function Step3(props: Step3) {
  const { tokenId, setTokenId, done } = props;
  const [cleartext, setCleartext] = useState("");

  return (
    <StepCard stepNumber={3} stepTitle="Encrypt Metadata and Mint">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            TokenId
          </label>
          <div className="mt-1">
            <input
              id="tokenId"
              name="tokenId"
              type="number"
              disabled={done}
              value={tokenId}
              onChange={(e) => setTokenId(parseInt(e.target.value))}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cleartext
          </label>
          <div className="mt-1">
            <input
              id="cleartext"
              name="cleartext"
              type="cleartext"
              disabled={done}
              value={cleartext}
              onChange={(e) => setCleartext(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <PrimaryButton
          onClick={() => {
            props.encryptAndMint(cleartext);
          }}
          disabled={props.done}
        >
          Encrypt And Mint
        </PrimaryButton>
      </div>
    </StepCard>
  );
}
