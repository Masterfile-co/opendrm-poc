import HorizontalSteps from "components/layout/HorizontalSteps";
import { useStep5 } from "hooks/pages/useStep5";
import Transfer from "components/step5/Transfer";
import Decrypt from "components/step5/Decrypt";
import { NextLayoutComponentType } from "next";
import React from "react";

const Step5: NextLayoutComponentType = () => {
  const { transferProps, decryptProps, active, localSteps, image } = useStep5();

  return (
    <div className="flex flex-col min-h-screen items-center w-full h-full">
      <HorizontalSteps steps={localSteps} />
      <div className="flex flex-grow h-full w-full justify-center items-center">
        {localSteps[0].active && (
          <Transfer {...transferProps} active={active} />
        )}
        {localSteps[1].active && <Decrypt {...decryptProps} image={image} />}
      </div>
    </div>
  );
};
export default Step5;
