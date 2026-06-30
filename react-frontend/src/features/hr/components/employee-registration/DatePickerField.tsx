import React from "react";
import { Label } from '@/lib/flowbite-compat';
import { Controller, type Control } from "react-hook-form";
import { format } from "date-fns";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';
import DatePicker from "../../../../components/common/DatePicker";

const DatePickerField = ({
  label,
  field,
  control,
}: {
  label: string;
  field: any;
  control: Control<EmployeeFormData>;
}) => (
  <div className="space-y-1.5">
    <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
      {label}
    </Label>
    <Controller
      control={control}
      name={field}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          value={value ? new Date(value) : null}
          onChange={(date) => onChange(format(date, "yyyy-MM-dd"))}
          placeholder="Select Date..."
        />
      )}
    />
  </div>
);

export default DatePickerField;
