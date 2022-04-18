import Link from "next/link";
import React from "react";
import { CheckIcon } from "@heroicons/react/solid";
import { useAppState } from "providers/OpenDRMProvider";

export default function VerticleSteps() {
  const { steps } = useAppState();
  
  return (
    <nav className="h-full flex items-center">
      <ol role="list">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col">
            <li>
              <Link href={`/step${step.label}`} passHref>
                <div className="flex items-center hover:cursor-pointer">
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
                    {step.done ? <CheckIcon className="h-5 w-5" /> : idx + 1}
                  </span>

                  <span
                    className={`ml-5 ${
                      step.done || step.active
                        ? "text-light-purple"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </Link>
            </li>
            {idx !== steps.length - 1 && (
              <div
                className={`ml-5 w-0.5 h-14 ${
                  step.done ? "bg-light-purple" : "bg-gray-500"
                }`}
              />
            )}
          </div>
        ))}
      </ol>
    </nav>
  );
}
