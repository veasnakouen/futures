import React from "react";
import {Label, TextInput} from '@/lib/flowbite-compat';
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';

interface EmergencyTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
}

const EmergencyTab: React.FC<EmergencyTabProps> = ({ formMethods }) => {
  const { register } = formMethods;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
          Full Name
        </Label>
        <TextInput
          {...register("emergencyContactName")}
          placeholder="e.g. Chan Sopheak"
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Relationship
          </Label>
          <TextInput {...register("emergencyContact")} />
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Emergency Phone
          </Label>
          <TextInput
            {...register("emergencyContactPhone")}
            placeholder="+855 ..."
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyTab;
