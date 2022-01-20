import { PrimaryButton } from "components/Button";

import EncryptData from "components/EncryptData";
import type { NextPage } from "next";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ConnectorNames } from "utils/connectors";

const Home: NextLayoutComponentType = () => {
  const { push } = useRouter();

  useEffect(() => {
    push("step1");
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full"></div>
  );
};

export default Home;
