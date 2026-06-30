import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "./DatePicker";
import { format } from "date-fns";

export interface CustomFieldDefinition {
  id: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string; // "TEXT", "NUMBER", "DATE", "SELECT"
  isRequired: boolean;
  options?: string;
}

interface Props {
  definitions: CustomFieldDefinition[];
  prefix?: string; // e.g., "customAttributes."
}

export default function DynamicCustomFields({ definitions, prefix = "" }: Props) {
  const { register, control, formState: { errors } } = useFormContext();

  if (!definitions || definitions.length === 0) return null;

  return (
    <>
      {definitions.map((def) => {
        const fieldName = `${prefix}${def.fieldName}`;
        // For nested errors if prefix is used
        const error = prefix ? (errors as any)[prefix.replace(".", "")]?.[def.fieldName] : errors[def.fieldName];

        return (
          <div key={def.id}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {def.fieldLabel} {def.isRequired && <span className="text-red-500">*</span>}
            </label>

            {def.fieldType === "TEXT" && (
              <input
                type="text"
                {...register(fieldName, { required: def.isRequired ? "Required" : false })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}

            {def.fieldType === "NUMBER" && (
              <input
                type="number"
                {...register(fieldName, { required: def.isRequired ? "Required" : false })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}

            {def.fieldType === "DATE" && (
              <Controller
                control={control}
                name={fieldName}
                rules={{ required: def.isRequired ? "Required" : false }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="" 
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="Select Date..."
                  />
                )}
              />
            )}

            {def.fieldType === "SELECT" && (
              <select
                {...register(fieldName, { required: def.isRequired ? "Required" : false })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select...</option>
                {def.options?.split(",").map((opt) => (
                  <option key={opt.trim()} value={opt.trim()}>
                    {opt.trim()}
                  </option>
                ))}
              </select>
            )}

            {error && <span className="text-red-500 text-xs mt-1">{error.message as string}</span>}
          </div>
        );
      })}
    </>
  );
}
