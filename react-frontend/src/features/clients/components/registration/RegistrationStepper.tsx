import React from "react";
import { User, MapPin, ClipboardList, Star, Check } from "lucide-react";

interface Props {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isEditMode: boolean;
  clientId?: number | string;
  isStep1Valid: () => boolean;
}

export default function RegistrationStepper({
  currentStep,
  setCurrentStep,
  isEditMode,
  clientId,
  isStep1Valid,
}: Props) {
  const steps = [
    { num: 1, title: "Basic Info", icon: User },
    { num: 2, title: "Contact", icon: MapPin },
    { num: 3, title: "Assessment", icon: ClipboardList },
    { num: 4, title: "Advanced", icon: Star },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b px-4 md:px-6 py-4 flex justify-between items-center overflow-x-auto custom-scrollbar">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.num || (isEditMode && step.num <= 3);
        const isActive = currentStep === step.num;
        const isLocked = step.num === 4 && !isEditMode && !clientId;

        return (
          <React.Fragment key={step.num}>
            <div
              className={`flex items-center gap-2 transition-all ${
                isActive ? "opacity-100 scale-105" : isLocked ? "opacity-30" : "opacity-60"
              } ${!isLocked ? "cursor-pointer hover:opacity-100" : "cursor-not-allowed"}`}
              onClick={() => {
                if (!isLocked) {
                  if (step.num > 1 && !isStep1Valid()) {
                    const form = document.getElementById("clientForm") as HTMLFormElement;
                    if (form) {
                      setCurrentStep(1);
                      setTimeout(() => {
                        form.reportValidity();
                      }, 100);
                    }
                  } else {
                    setCurrentStep(step.num);
                  }
                }
              }}
            >
              <div
                className={`w-8 h-8 shrink-0 aspect-square min-w-[2rem] min-h-[2rem] rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow-blue-500/30"
                    : isCompleted
                    ? "bg-emerald-500 text-white shadow-emerald-500/30"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {isCompleted && !isActive ? <Check size={14} /> : <Icon size={14} />}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && <div className="flex-1 mx-2 sm:mx-4 max-w-[60px] border-t-2" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
