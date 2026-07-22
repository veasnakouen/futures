import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { PatientFormValues } from "./patientSchema";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { User, CreditCard, Droplet, Phone, Mail, Shield } from "lucide-react";

interface Props {
  register: UseFormRegister<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
  control: Control<PatientFormValues>;
}

export const PatientPersonalInfoFields: React.FC<Props> = ({ register, errors, control }) => {
  return (
    <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
      <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
        <User size={15} /> Personal Identity & Clinical Info
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            First Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("firstName")}
              placeholder="e.g. John"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.firstName && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.firstName.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("lastName")}
              placeholder="e.g. Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.lastName && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.lastName.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Medical Record No. (MRN)
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("medicalRecordNumber")}
              placeholder="Optional / Auto-generated"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Blood Group
          </label>
          <div className="relative">
            <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
            <select
              {...register("bloodType")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">Blood A+</option>
              <option value="A-">Blood A-</option>
              <option value="B+">Blood B+</option>
              <option value="B-">Blood B-</option>
              <option value="AB+">Blood AB+</option>
              <option value="AB-">Blood AB-</option>
              <option value="O+">Blood O+</option>
              <option value="O-">Blood O-</option>
            </select>
          </div>
        </div>

        <div>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Date of Birth *"
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(format(date, "yyyy-MM-dd"))}
                placeholder="Select Date of Birth..."
              />
            )}
          />
          {errors.dateOfBirth && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.dateOfBirth.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Gender <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("gender")}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Contact Phone <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("contactNumber")}
              placeholder="e.g. +855 12 345 678"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.contactNumber && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.contactNumber.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. patient@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.email && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.email.message}</span>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            Poor ID / Social Equity Beneficiary Card No.
          </label>
          <div className="relative">
            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
            <input
              {...register("poorId")}
              placeholder="Optional: Enter Poor ID number for healthcare equity coverage"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
