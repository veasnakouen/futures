import React from "react";
import { Button, Badge } from "@/lib/flowbite-compat";
import { Trash2 } from "lucide-react";

interface Props {
  state: any;
}

export default function CustomFieldsList({ state }: Props) {
  const {
    fields,
    selectedEntityType,
    setShowCreateModal,
    showLivePreview,
    handleDeleteField,
    getTypeIcon,
  } = state;

  return (
    <div className={showLivePreview ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Active Fields ({fields.length})
        </h3>
      </div>

      {fields.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 text-center rounded-2xl border border-gray-100 dark:border-gray-700/60">
          <p className="text-sm font-bold text-gray-500">
            No custom fields defined for {selectedEntityType} yet.
          </p>
          <Button
            color="blue"
            size="xs"
            onClick={() => setShowCreateModal(true)}
            className="mt-3 mx-auto cursor-pointer"
          >
            Define First Field
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field: any) => {
            const IconComp = getTypeIcon(field.fieldType);
            return (
              <div
                key={field.id || field.fieldKey}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
                      <IconComp size={16} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                        {field.fieldType}
                      </span>
                    </div>
                    {field.isRequired && (
                      <Badge color="failure" size="sm" className="font-bold">
                        Required
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-base font-black text-gray-900 dark:text-white">
                    {field.fieldLabel}
                  </h4>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">
                    Key: <span className="text-indigo-600 dark:text-indigo-400">{field.fieldKey}</span>
                  </p>

                  {field.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                      {field.description}
                    </p>
                  )}

                  {field.options && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {field.options.split(",").map((opt: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-gray-750 text-slate-600 dark:text-gray-300"
                        >
                          {opt.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Field"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
