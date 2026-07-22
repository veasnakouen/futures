import React from "react";
import { UseFormRegister } from "react-hook-form";
import { DoctorFormValues } from "./doctorSchema";
import { ShieldCheck, FileCheck, Briefcase, DollarSign } from "lucide-react";

interface Props {
  register: UseFormRegister<DoctorFormValues>;
}

export const DoctorCredentialsFields: React.FC<Props> = ({ register }) => {
  return (
    <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
      <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
        <ShieldCheck size={15} /> Credentials & Professional Licensing
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Medical License Number
          </label>
          <div className="relative">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <input
              {...register("licenseNumber")}
              placeholder="e.g. LIC-9988421"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            NPI Registry Number
          </label>
          <div className="relative">
            <FileCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <input
              {...register("npiNumber")}
              placeholder="e.g. NPI-10928374"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Years of Practice Experience
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              {...register("yearOfExperience")}
              placeholder="e.g. 12"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Standard Consultation Fee ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
            <input
              type="number"
              step="0.01"
              {...register("consultationFee")}
              placeholder="e.g. 50.00"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
