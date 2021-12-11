import { useDemo } from "hooks/useDemo";
import { useOpenDRM } from "hooks/useOpenDRM";
import React from "react";
import Step1 from "./demo/step1";
import Step2 from "./demo/step2";
import Step3 from "./demo/step3";
import Step4 from "./demo/step4";
import Step5 from "./demo/step5";
import EncryptData from "./EncryptData";
import Metadata from "./MetadataCard";

export default function Demo() {
  const { step1, step2, step3, step4, step5, tokenProps } = useDemo();

  
  return (
    <div className="flex flex-col space-y-4 mt-4">
      <Step1 {...step1} />
      {step1.done && <Step2 {...step2} />}
      {step2.done && <Step3 {...step3} {...tokenProps} />}
      {step3.done && <Step4 {...step4} {...tokenProps} />}
      {step4.done && <Step5 {...step5} />}
      {/* <div className="flex space-x-2">
        <Metadata metadata={metadataProps.metadata} />
        <EncryptData
          {...encryptDataProps}
          encryptCleartext={encryptCleartext}
          grantPolicy={grantPolicy}
          deriveId={deriveId}
        />
      </div> */}
    </div>
  );
}
