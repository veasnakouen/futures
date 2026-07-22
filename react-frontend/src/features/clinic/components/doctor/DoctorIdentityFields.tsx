import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DoctorFormValues } from "./doctorSchema";
import { User, Award, Phone, Mail } from "lucide-react";

interface Props {
  register: UseFormRegister<DoctorFormValues>;
  errors: FieldErrors<DoctorFormValues>;
}

export const DoctorIdentityFields: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
      <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
        <User size={15} /> Practitioner Identity & Specialty
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
              placeholder="e.g. Sarah"
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
              placeholder="e.g. Jenkins"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.lastName && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.lastName.message}</span>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Specialization / Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              {...register("specialization")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            >
              <option value="">Select Specialization Specialty...</option>
              <option value="General Practice">General Practice (Family Medicine)</option>
              <option value="Cardiologist">Cardiologist (Cardiovascular Surgery)</option>
              <option value="Neurologist">Neurologist (Neurology & Brain Sciences)</option>
              <option value="Orthopedic">Orthopedic Surgeon</option>
              <option value="Pediatrics">Pediatrics & Neonatal Care</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Other">Other Clinical Department</option>
            </select>
          </div>
          {errors.specialization && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.specialization.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Direct Phone <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("contactNumber")}
              placeholder="e.g. +855 12 999 888"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.contactNumber && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.contactNumber.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Official Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. dr.jenkins@futures-clinic.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          {errors.email && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.email.message}</span>}
        </div>
      </div>
    </div>
  );
};
