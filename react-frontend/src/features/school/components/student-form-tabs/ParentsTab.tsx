import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function ParentsTab({
  form,
  t,
  parentsData,
}: StudentFormTabProps) {
  const { watch, setValue } = form;
  const currentParentRelationships = watch("parentRelationships") || [];

  const handleParentToggle = (parentId: string) => {
    const exists = currentParentRelationships.find((pr: any) => pr.parentId === parentId);
    if (exists) {
      setValue("parentRelationships", currentParentRelationships.filter((pr: any) => pr.parentId !== parentId));
    } else {
      setValue("parentRelationships", [...currentParentRelationships, { parentId, relationshipType: "MOTHER" }]);
    }
  };

  const handleRelationshipTypeChange = (parentId: string, type: string) => {
    setValue(
      "parentRelationships",
      currentParentRelationships.map((pr: any) =>
        pr.parentId === parentId ? { ...pr, relationshipType: type } : pr
      )
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
          {t("selectParentsGuardians")}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t("chooseParentsDesc")}
        </p>
      </div>
      {(!parentsData || (parentsData.content ? parentsData.content.length === 0 : parentsData.length === 0)) && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-sm text-gray-500 italic">No parents found in the database.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {(parentsData?.content || (Array.isArray(parentsData) ? parentsData : [])).map((parent: any) => {
          const isSelected = currentParentRelationships.some((pr: any) => pr.parentId === parent.id);
          return (
            <div
              key={parent.id}
              className={`flex flex-col p-4 rounded-xl transition-all duration-200 cursor-pointer ${isSelected ? "bg-blue-50 border border-blue-300 dark:bg-blue-900/20 dark:border-blue-700" : "bg-white border border-gray-100 dark:border-gray-800 hover:border-blue-300 hover:shadow-sm dark:bg-gray-800"}`}
              onClick={(e) => {
                // Prevent toggling when clicking the select dropdown
                if ((e.target as HTMLElement).tagName !== 'SELECT') {
                  handleParentToggle(parent.id);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-md mr-3 ${isSelected ? 'bg-blue-600 border border-blue-600' : 'bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {parent.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {parent.contactNumber}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-1/3" onClick={e => e.stopPropagation()}>
                    <select
                      className="w-full px-2 py-1.5 text-sm font-medium border-blue-200 dark:border-blue-800 rounded bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={currentParentRelationships.find((pr: any) => pr.parentId === parent.id)?.relationshipType || "MOTHER"}
                      onChange={(e) => handleRelationshipTypeChange(parent.id, e.target.value)}
                    >
                      <option value="MOTHER">{t("mother")}</option>
                      <option value="FATHER">{t("father")}</option>
                      <option value="UNCLE">{t("uncle")}</option>
                      <option value="AUNT">{t("aunt")}</option>
                      <option value="BROTHER">{t("brother")}</option>
                      <option value="SISTER">{t("sister")}</option>
                      <option value="GRANDPARENT">{t("grandparent")}</option>
                      <option value="GUARDIAN">{t("guardian")}</option>
                      <option value="OTHER">{t("other")}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
