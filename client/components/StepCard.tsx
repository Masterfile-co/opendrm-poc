import React, { ReactChild } from "react";

interface IStepCard {
  stepNumber: number;
  stepTitle: string;
  children: ReactChild;
}

export default function StepCard(props: IStepCard) {
  const { stepNumber, stepTitle, children } = props;
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="flex flex-col max-w-lg p-2">
        <span className="mb-4 border-b-2">
          Step {stepNumber} - {stepTitle}
        </span>
        {children}
      </div>
    </div>
  );
}
