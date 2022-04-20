import { CheckIcon } from "@heroicons/react/solid";

import React from "react";
import { Step } from "utils/types";


export default function HorizontalSteps({ steps }: { steps: Step[] }) {
  return (
    <nav className="w-full flex justify-center mt-12">
      <ol role="list" className="flex w-full max-w-[580px] justify-center">
        {steps.map((step, idx) => (
          <div key={idx} className="flex w-full justify-center relative">
            <li>
              <div className="flex flex-col items-center w-20">
                <span
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${
                      step.done
                        ? "bg-light-purple text-sidebar"
                        : step.active
                        ? "border-2 border-light-purple text-light-purple"
                        : "border-2 border-gray-500 text-gray-500"
                    }`}
                >
                  {step.done ? <CheckIcon className="h-5 w-5" /> : step.label}
                </span>

                <span
                  className={` mt-4 ${
                    step.done || step.active
                      ? "text-light-purple"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </li>
            {idx !== steps.length - 1 && (
              <div className={`w-full px-5 absolute inset-1/2 top-0 `}>
                <div
                  className={`h-0.5 mt-5 ${
                    step.done ? "bg-light-purple" : "bg-gray-500"
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </ol>
    </nav>
  );
}
