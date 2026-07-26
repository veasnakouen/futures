import React from "react";
import { Camera, Smartphone, Fingerprint, Key } from "lucide-react";
import { VerificationMode } from "./scannerTypes";

interface ScannerModeTabsProps {
  activeMode: VerificationMode;
  onSelectMode: (mode: VerificationMode) => void;
}

export default function ScannerModeTabs({
  activeMode,
  onSelectMode,
}: ScannerModeTabsProps) {
  const modes: { id: VerificationMode; label: string; icon: any }[] = [
    { id: "camera_qr", label: "Camera Scanner", icon: Camera },
    { id: "my_badge", label: "Digital Staff Badge", icon: Smartphone },
    { id: "biometric", label: "Fingerprint / Face ID", icon: Fingerprint },
    { id: "manual_pin", label: "Staff PIN Override", icon: Key },
  ];

  return (
    <div className="w-full flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl mb-6 gap-1">
      {modes.map((m) => {
        const Icon = m.icon;
        const active = activeMode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              active
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon size={14} /> <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
