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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("clinicPatientId")}
        </label>
        <input
          {...register("clinicPatientId")}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Link to mtp-clinic-service (Optional)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("emergencyMedicalNotes")}
        </label>
        <textarea
          {...register("medicalConditions")}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="List any known allergies, medications, or specific medical conditions here..."
        />
      </div>
    </div>
  );
}
