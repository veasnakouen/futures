import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function ParentsTab({
  form,
  t = (k) => k,
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

  const list = parentsData?.content || (Array.isArray(parentsData) ? parentsData : []);

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
          {t("selectParentsGuardians") || "Select Parents / Guardians"}
        </label>
        <p className="text-[10px] text-gray-400">
          {t("chooseParentsDesc") || "Choose parents or guardians to link with this student."}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-xs text-gray-500 italic">No parents found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {list.map((parent: any) => {
            const isSelected = currentParentRelationships.some((pr: any) => pr.parentId === parent.id);
            return (
              <div
                key={parent.id}
                className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                  isSelected ? "bg-blue-50 border-blue-300 dark:bg-blue-900/30" : "bg-gray-50 dark:bg-gray-800"
                }`}
                onClick={() => handleParentToggle(parent.id)}
              >
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={isSelected} readOnly className="rounded text-blue-600" />
                  <div>
                    <p className="font-bold text-xs">{parent.firstName} {parent.lastName}</p>
                    <p className="text-[10px] text-gray-400">{parent.phone || parent.email || "No contact info"}</p>
                  </div>
                </div>

                {isSelected && (
                  <select
                    value={currentParentRelationships.find((pr: any) => pr.parentId === parent.id)?.relationshipType || "MOTHER"}
                    onChange={(e) => handleRelationshipTypeChange(parent.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold rounded-lg border-gray-300 dark:bg-gray-700 h-8"
                  >
                    <option value="MOTHER">Mother</option>
                    <option value="FATHER">Father</option>
                    <option value="GUARDIAN">Guardian</option>
                    <option value="OTHER">Other</option>
                  </select>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
