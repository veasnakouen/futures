import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function ActivitiesTab({
  form,
  t = (k) => k,
  extracurricularsData,
}: StudentFormTabProps) {
  const { watch, setValue } = form;
  const currentExtracurricularIds = watch("extracurricularIds") || [];

  const handleExtracurricularToggle = (activityId: string) => {
    if (currentExtracurricularIds.includes(activityId)) {
      setValue("extracurricularIds", currentExtracurricularIds.filter((id: string) => id !== activityId));
    } else {
      setValue("extracurricularIds", [...currentExtracurricularIds, activityId]);
    }
  };

  const list = (extracurricularsData as any)?.content || (Array.isArray(extracurricularsData) ? extracurricularsData : []);

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
          {t("selectExtracurricularActivities") || "Extracurricular Activities"}
        </label>
        <p className="text-[10px] text-gray-400">
          {t("enrollActivitiesDesc") || "Select activities to enroll student into."}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-xs text-gray-500 italic">No activities found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((activity: any) => {
            const isSelected = currentExtracurricularIds.includes(activity.id);
            return (
              <div
                key={activity.id}
                onClick={() => handleExtracurricularToggle(activity.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isSelected ? "bg-blue-50 border-blue-300 dark:bg-blue-900/30" : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <input type="checkbox" checked={isSelected} readOnly className="rounded text-blue-600" />
                <div>
                  <p className="font-bold text-xs">{activity.name}</p>
                  <p className="text-[10px] text-gray-400">{activity.category || "General Activity"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
