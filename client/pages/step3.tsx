import { NextLayoutComponentType } from "next";
import React from "react";
import { Step3Provider } from "providers/pages/Step3Provider";
// import Step3Page from "components/step3";
import dynamic from "next/dynamic";

const Step3Page = dynamic(() => import("components/step3"), { ssr: false });

const Step3: NextLayoutComponentType = () => {
  return (
    <Step3Provider>
      <Step3Page />
    </Step3Provider>
  );
};

Step3.getInitialProps = () => {
  return {};
};

export default Step3;
