import { NextLayoutComponentType } from "next";
import React from "react";
import Step4Page from "components/step4";

const Step4: NextLayoutComponentType = () => {
  return <Step4Page />;
};

Step4.getInitialProps = () => {
  return {};
};

export default Step4;
