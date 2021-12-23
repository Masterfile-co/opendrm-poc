import { PrimaryButton } from "components/Button";
import Demo from "components/Demo";
import EncryptData from "components/EncryptData";
import { useConnect } from "hooks/connect/useConnect";
import type { NextPage } from "next";
import type { NextLayoutComponentType } from "next";
import { ConnectorNames } from "utils/connectors";

const Home: NextLayoutComponentType = () => {
  const { error } = useConnect();

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Demo />
    </div>
  );
};

export default Home;
