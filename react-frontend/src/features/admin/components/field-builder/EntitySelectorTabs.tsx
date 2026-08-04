import React from "react";
import { ENTITY_TYPES } from "@/features/admin/hooks/useCustomFieldBuilderState";

interface Props {
  state: any;
}

export default function EntitySelectorTabs({ state }: Props) {
  const { selectedEntityType, setSelectedEntityType } = state;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {ENTITY_TYPES.map((ent) => {
        const isActive = selectedEntityType === ent.key;
        return (
          <button
            key={ent.key}
            onClick={() => setSelectedEntityType(ent.key)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700/60 hover:bg-gray-50"
            }`}
          >
            <span>{ent.label}</span>
          </button>
        );
      })}
    </div>
  );
}
