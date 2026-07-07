import React from "react";
import {Label, Select, Button, Progress} from '@/lib/flowbite-compat';
import { ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';

interface BiometricsTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
  isEnrolling: boolean;
  setIsEnrolling: (val: boolean) => void;
  enrollmentProgress: number;
  setEnrollmentProgress: (val: number) => void;
}

const BiometricsTab: React.FC<BiometricsTabProps> = ({
  formMethods,
  isEnrolling,
  setIsEnrolling,
  enrollmentProgress,
  setEnrollmentProgress,
}) => {
  const { watch, setValue } = formMethods;
  const formData = watch();

  return (
    <div className="space-y-10 animate-fade-in py-6">
      <div className="max-w-md mx-auto text-center space-y-8">
        <div
          className={`w-32 h-32 mx-auto rounded-md flex items-center justify-center transition-all duration-700 ${isEnrolling ?"bg-blue-100 dark:bg-blue-900/30 text-blue-600 scale-110": formData.biometricStatus ==="Enrolled"?"bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600":"bg-gray-100 dark:bg-gray-700 text-gray-400"}`}
        >
          <div className="relative">
            <ShieldCheck
              size={64}
              className={isEnrolling ? "animate-pulse":""}
            />
            {isEnrolling && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="xl" className="text-blue-600" />
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
            Biometric Enrollment
          </h4>
          <p className="text-xs font-bold text-gray-400 mt-2">
            Connect to a network scanner to register this staff's fingerprint.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <Label className="font-black text-[10px] uppercase text-gray-400 ml-1">
              Enrollment Node (Network Scanner)
            </Label>
            <Select>
              <option>Main Lobby Scanner (192.168.1.101)</option>
              <option>HR Office Station (192.168.1.115)</option>
            </Select>
          </div>

          {isEnrolling ? (
            <div className="space-y-3">
              <Progress progress={enrollmentProgress} size="lg" color="blue" />
              <p className="text-[10px] font-black text-blue-600 uppercase animate-pulse">
                Scanning Right Index Finger... {enrollmentProgress}%
              </p>
            </div>
          ) : formData.biometricStatus === "Enrolled" ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-md border-emerald-100 dark:border-emerald-900/20">
              <p className="text-xs font-black text-emerald-600 uppercase">
                Fingerprint Successfully Registered
              </p>
              <p className="text-[9px] font-bold text-emerald-600/60 mt-1 uppercase">
                Hardware ID: {formData.biometricId || "MTP-FP-77291"}
              </p>
            </div>
          ) : (
            <Button
              color="blue"
              className="w-full rounded-md h-14 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
              onClick={() => {
                setIsEnrolling(true);
                let p = 0;
                const interval = setInterval(() => {
                  p += 5;
                  setEnrollmentProgress(p);
                  if (p >= 100) {
                    clearInterval(interval);
                    setIsEnrolling(false);
                    setValue("biometricStatus", "Enrolled", {
                      shouldDirty: true,
                    });
                    setValue(
                      "biometricId",
                      "MTP-FP-" + Math.floor(10000 + Math.random() * 90000),
                      { shouldDirty: true },
                    );
                  }
                }, 100);
              }}
            >
              Initialize Enrollment
            </Button>
          )}
        </div>

        <div className="pt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-md text-left">
            <p className="text-[8px] font-black text-gray-400 uppercase">
              Biometric ID
            </p>
            <p className="text-sm font-black dark:text-white mt-1">
              {formData.biometricId || "PENDING"}
            </p>
          </div>
          <div className="p-4 rounded-md text-left">
            <p className="text-[8px] font-black text-gray-400 uppercase">
              Hardware Sync
            </p>
            <p className="text-sm font-black dark:text-white mt-1">
              {formData.biometricStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricsTab;
