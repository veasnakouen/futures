import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function MedicalTab({
  form,
  t,
}: StudentFormTabProps) {
  const { register } = form;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
          {t("clinicPatientId")}
        </label>
        <input
          {...register("clinicPatientId")}
          className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Link to mtp-clinic-service (Optional)"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
          {t("emergencyMedicalNotes")}
        </label>
        <textarea
          {...register("medicalConditions")}
          rows={4}
          className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="List any known allergies, medications, or specific medical conditions here..."
        />
      </div>
    </div>
  );
}
