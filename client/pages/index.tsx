import { PrimaryButton } from "components/Button";
import Demo from "components/Demo";
import EncryptData from "components/EncryptData";
import { useConnect } from "hooks/connect/useConnect";
import type { NextPage } from "next";
import type { NextLayoutComponentType } from "next";
import { ConnectorNames } from "utils/connectors";

const Home: NextLayoutComponentType = () => {
  const { requestConnection, error, active } = useConnect();

  return (
    <div className="bg-gray-500 min-h-screen">
      {error && <span className="flex bg-red-500">{error.message}</span>}
      {!active && (
        <PrimaryButton
          onClick={() => {
            requestConnection(ConnectorNames.Injected);
          }}
        >
          Connect Wallet
        </PrimaryButton>
      )}
      <div className="flex flex-col justify-center items-center w-full">
        <Demo />
      </div>
    </div>
  );
};

export default Home;
