import React from "react";
import { Button, TextInput, Select, Checkbox } from "@/lib/flowbite-compat";
import { Eye } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  state: any;
}

export default function LiveFormPreviewCard({ state }: Props) {
  const { fields, showLivePreview, previewValues, setPreviewValues } = state;

  if (!showLivePreview) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm h-fit">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/60">
        <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Eye size={18} className="text-indigo-600 dark:text-indigo-400" />
          <span>Live UI Form Preview</span>
        </h3>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
          Runtime Render
        </span>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No fields defined yet. Add fields to preview interactive form inputs.
          </p>
        ) : (
          fields.map((field: any) => (
            <div key={field.fieldKey} className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {field.fieldLabel} {field.isRequired && <span className="text-rose-500">*</span>}
              </label>

              {field.fieldType === "TEXT" && (
                <TextInput
                  placeholder={`Enter ${field.fieldLabel}...`}
                  value={previewValues[field.fieldKey] || ""}
                  onChange={(e) =>
                    setPreviewValues({ ...previewValues, [field.fieldKey]: e.target.value })
                  }
                  className="text-xs"
                />
              )}

              {field.fieldType === "NUMBER" && (
                <TextInput
                  type="number"
                  placeholder="0"
                  value={previewValues[field.fieldKey] || ""}
                  onChange={(e) =>
                    setPreviewValues({ ...previewValues, [field.fieldKey]: e.target.value })
                  }
                />
              )}

              {field.fieldType === "DATE" && (
                <TextInput
                  type="date"
                  value={previewValues[field.fieldKey] || ""}
                  onChange={(e) =>
                    setPreviewValues({ ...previewValues, [field.fieldKey]: e.target.value })
                  }
                />
              )}

              {field.fieldType === "BOOLEAN" && (
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id={field.fieldKey}
                    checked={!!previewValues[field.fieldKey]}
                    onChange={(e) =>
                      setPreviewValues({ ...previewValues, [field.fieldKey]: e.target.checked })
                    }
                  />
                  <label
                    htmlFor={field.fieldKey}
                    className="text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    Enable {field.fieldLabel}
                  </label>
                </div>
              )}

              {field.fieldType === "SELECT" && (
                <Select
                  value={previewValues[field.fieldKey] || ""}
                  onChange={(e) =>
                    setPreviewValues({ ...previewValues, [field.fieldKey]: e.target.value })
                  }
                >
                  <option value="">Select option...</option>
                  {field.options?.split(",").map((opt: string, i: number) => (
                    <option key={i} value={opt.trim()}>
                      {opt.trim()}
                    </option>
                  ))}
                </Select>
              )}

              {field.fieldType === "TEXTAREA" && (
                <textarea
                  rows={2}
                  placeholder={`Enter ${field.fieldLabel}...`}
                  value={previewValues[field.fieldKey] || ""}
                  onChange={(e) =>
                    setPreviewValues({ ...previewValues, [field.fieldKey]: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))
        )}

        {fields.length > 0 && (
          <Button
            color="blue"
            size="sm"
            className="w-full rounded-xl font-bold mt-4 cursor-pointer"
            onClick={() => toast.success("Form validated successfully!")}
          >
            Test Submit Payload
          </Button>
        )}
      </div>
    </div>
  );
}
