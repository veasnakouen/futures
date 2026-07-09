import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function ActivitiesTab({
  form,
  t,
  extracurricularsData,
}: StudentFormTabProps) {
  const { watch, setValue } = form;
  const currentExtracurricularIds = watch("extracurricularIds") || [];

  const handleExtracurricularToggle = (activityId: string) => {
    if (currentExtracurricularIds.includes(activityId)) {
      setValue("extracurricularIds", currentExtracurricularIds.filter(id => id !== activityId));
    } else {
      setValue("extracurricularIds", [...currentExtracurricularIds, activityId]);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("selectExtracurricularActivities")}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t("enrollActivitiesDesc")}
        </p>
      </div>
      {(!extracurricularsData || (extracurricularsData.content ? extracurricularsData.content.length === 0 : extracurricularsData.length === 0)) && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-sm text-gray-500 italic">No activities found in the database.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(extracurricularsData?.content || (Array.isArray(extracurricularsData) ? extracurricularsData : [])).map((activity: any) => {
          const isSelected = currentExtracurricularIds.includes(activity.id);
          return (
            <div
              key={activity.id}
              className={`flex items-center p-4 rounded-xl transition-all duration-200 cursor-pointer ${isSelected ? "bg-indigo-50 border border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700 shadow-sm" : "bg-white border border-gray-100 dark:border-gray-800 hover:border-indigo-200 hover:shadow-sm dark:bg-gray-800"}`}
              onClick={() => handleExtracurricularToggle(activity.id)}
            >
              <div className={`flex items-center justify-center w-5 h-5 rounded-md mr-3 ${isSelected ? 'bg-indigo-600 border border-indigo-600' : 'bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                  {activity.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
