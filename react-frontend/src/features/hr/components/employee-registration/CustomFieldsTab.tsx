import React from "react";
import {Button, TextInput} from '@/lib/flowbite-compat';
import { Trash2 } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';

interface CustomFieldsTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
}

const CustomFieldsTab: React.FC<CustomFieldsTabProps> = ({ formMethods }) => {
  const { register, control } = formMethods;
  const {
    fields: customFieldItems,
    append: appendCustomField,
    remove: removeCustomField,
  } = useFieldArray({
    control,
    name: "customFields",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black dark:text-white uppercase tracking-widest">
          Custom Record Fields
        </h4>
        <Button
          color="light"
          size="xs"
          onClick={() => appendCustomField({ key: "", value: "" })}
        >
          Add Field
        </Button>
      </div>
      <div className="space-y-3">
        {customFieldItems.map((field, idx) => (
          <div key={field.id} className="flex gap-3">
            <TextInput
              placeholder="Label (e.g. T-Shirt Size)"
              className="flex-1"
              {...register(`customFields.${idx}.key` as const)}
            />
            <TextInput
              placeholder="Value"
              className="flex-1"
              {...register(`customFields.${idx}.value` as const)}
            />
            <button
              type="button"
              className="text-red-500 p-2"
              onClick={() => removeCustomField(idx)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFieldsTab;
