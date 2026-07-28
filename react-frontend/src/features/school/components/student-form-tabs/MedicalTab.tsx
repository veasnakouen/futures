import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function MedicalTab({
  form,
  t = (k) => k,
}: StudentFormTabProps) {
  const { register } = form;

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
          {t("clinicPatientId") || "Clinic Patient ID"}
        </label>
        <input
          {...register("clinicPatientId" as any)}
          className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
          placeholder="Link to mtp-clinic-service (Optional)"
        />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
          {t("emergencyMedicalNotes") || "Medical Notes & Allergies"}
        </label>
        <textarea
          {...register("medicalConditions" as any)}
          rows={3}
          className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium p-3"
          placeholder="List any known allergies, medications, or specific medical conditions here..."
        />
      </div>
    </div>
  );
}
