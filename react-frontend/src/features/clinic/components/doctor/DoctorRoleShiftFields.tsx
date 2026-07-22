import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { DoctorFormValues } from "./doctorSchema";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { BadgeCheck, Clock } from "lucide-react";

interface Props {
  register: UseFormRegister<DoctorFormValues>;
  errors: FieldErrors<DoctorFormValues>;
  control: Control<DoctorFormValues>;
}

export const DoctorRoleShiftFields: React.FC<Props> = ({ register, errors, control }) => {
  return (
    <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4 mb-2">
      <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
        <BadgeCheck size={15} /> Organizational Role & Shift Schedule
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Employee ID Code
          </label>
          <input
            {...register("employeeId")}
            placeholder="e.g. EMP-77402 (Auto-generated if empty)"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Clinical Role <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("role")}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all shadow-sm"
          >
            <option value="Doctor">Doctor / Attending Physician</option>
            <option value="Specialist">Senior Specialist</option>
            <option value="Nurse">Registered Nurse</option>
            <option value="Administrator">Clinical Administrator</option>
            <option value="Receptionist">Medical Receptionist</option>
          </select>
          {errors.role && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.role.message}</span>}
        </div>

        <div>
          <Controller
            control={control}
            name="hiredDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Hired Start Date"
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                placeholder="Select Hiring Date..."
              />
            )}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Duty Shift Roster
          </label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              {...register("shift")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all shadow-sm"
            >
              <option value="Full Day">Full Day Work (08:00 - 17:00 / Full-Time)</option>
              <option value="Morning">Morning Shift (07:00 - 15:00)</option>
              <option value="Evening">Evening Shift (15:00 - 23:00)</option>
              <option value="Night">Night On-Call Shift (23:00 - 07:00)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
