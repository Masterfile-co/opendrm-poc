import { NextLayoutComponentType } from "next";
import React from "react";
import Step5Page from "components/step5";
import { Step5Provider } from "providers/pages/Step5Provider";

const Step5: NextLayoutComponentType = () => {
  return (
    <Step5Provider>
      <Step5Page />
    </Step5Provider>
  );
};

Step5.getInitialProps = () => {
  return {};
};

export default Step5;
