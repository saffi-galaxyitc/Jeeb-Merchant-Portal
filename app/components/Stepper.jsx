"use client";

import { FaCheck } from "react-icons/fa";
import clsx from "clsx";

const totalSteps = 3;

export default function Stepper({ step = 0 }) {
  return (
    <div className="flex justify-center items-center gap-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < step;
        const isActive = index === step;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Step circle */}
            <div
              className={clsx(
                "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                {
                  "bg-green-500": isCompleted,
                  "bg-gray-950": isActive,
                  "bg-gray-300": !isCompleted && !isActive,
                }
              )}
            >
              {isCompleted ? <FaCheck size={18} /> : index + 1}
            </div>

            {/* Connector */}
            {index < totalSteps - 1 && (
              <div
                className={clsx("h-1 w-10", {
                  "bg-green-500": index < step - 1,
                  "bg-gray-300": index >= step - 1,
                })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
