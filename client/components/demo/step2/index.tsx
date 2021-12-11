import { PrimaryButton } from "components/Button";
import StepCard from "components/StepCard";
import React, { useState } from "react";

interface Step2 {
  registerUser: (secretKey: string) => void;
  done: boolean
}

export default function Step2(props: Step2) {
  const [ps, setPs] = useState("");

  return (
    <StepCard stepNumber={2} stepTitle="Register your NuCypher Account">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="secretKey"
              name="secretKey"
              type="password"
              value={ps}
              onChange={(e) => setPs(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <PrimaryButton
          onClick={() => {
            props.registerUser(ps);
            setPs("")
          }}
          disabled={props.done}
        >
          Register
        </PrimaryButton>
      </div>
    </StepCard>
  );
}
