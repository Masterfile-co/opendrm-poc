import React from "react";
import { PrimaryButton } from "./Button";

interface IEncryptData {
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  cleartext: string;
  setCleartext: React.Dispatch<React.SetStateAction<string>>;
  encryptCleartext: () => void;
  grantPolicy: () => void;
  deriveId: () => void;
}

export default function EncryptData(props: IEncryptData) {
  const {
    label,
    cleartext,
    setLabel,
    setCleartext,
    encryptCleartext,
    grantPolicy,
    deriveId,
  } = props;
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cleartext
          </label>
          <div className="mt-1">
            <input
              id="cleartext"
              name="cleartext"
              type="cleartext"
              value={cleartext}
              onChange={(e) => setCleartext(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="label"
            className="block text-sm font-medium text-gray-700"
          >
            Label
          </label>
          <div className="mt-1">
            <input
              id="label"
              name="label"
              type="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <PrimaryButton
          onClick={() => {
            encryptCleartext();
          }}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Encrypt
        </PrimaryButton>

        <PrimaryButton
          onClick={() => {
            grantPolicy();
          }}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          GrantPolicy
        </PrimaryButton>

        <PrimaryButton
          onClick={() => {
            deriveId();
          }}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          DeriveId
        </PrimaryButton>
      </div>
    </div>
  );
}
