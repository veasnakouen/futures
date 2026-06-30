import React from "react";
import { Label, TextInput } from '@/lib/flowbite-compat';
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';

interface FinancialTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ formMethods }) => {
  const {
    register,
    formState: { errors },
  } = formMethods;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
          Base Salary (USD)
        </Label>
        <TextInput
          type="number"
          {...register("basicSalary", { valueAsNumber: true })}
          color={errors.basicSalary ? "failure" : undefined}
        />
        {errors.basicSalary && (
          <p className="text-[10px] font-bold text-red-500 mt-1">
            {errors.basicSalary.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Bank Name
          </Label>
          <TextInput {...register("bankName")} placeholder="e.g. ABA Bank" />
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Account Number
          </Label>
          <TextInput
            {...register("bankAccountNumber")}
            placeholder="000 123 456"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialTab;
