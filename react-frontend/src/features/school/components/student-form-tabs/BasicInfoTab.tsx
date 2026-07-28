import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";
import DatePicker from "../../../../components/common/DatePicker";
import { format } from "date-fns";

export default function BasicInfoTab({
  form,
  t = (k) => k,
}: StudentFormTabProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const dateOfBirth = watch("dateOfBirth");
  const enrollmentDate = watch("enrollmentDate");

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("firstName") || "First Name"}
          </label>
          <input
            {...register("firstName")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="John"
          />
          {errors.firstName && <span className="text-red-500 text-[10px] mt-1">{String(errors.firstName.message || "")}</span>}
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("middleName") || "Middle Name"}
          </label>
          <input
            {...register("middleName")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="Robert"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("lastName") || "Last Name"}
          </label>
          <input
            {...register("lastName")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="Doe"
          />
          {errors.lastName && <span className="text-red-500 text-[10px] mt-1">{String(errors.lastName.message || "")}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("emailAddress") || "Email Address"}
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="john.doe@example.com"
          />
          {errors.email && <span className="text-red-500 text-[10px] mt-1">{String(errors.email.message || "")}</span>}
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("studentIdNumber") || "Student ID Number"}
          </label>
          <input
            {...register("studentIdNumber")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="STU-12345"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("gender") || "Gender"}
          </label>
          <select
            {...register("gender")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
          >
            <option value="">Select Gender...</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("nationality") || "Nationality"}
          </label>
          <input
            {...register("nationality")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="Cambodian"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("dateOfBirth") || "Date of Birth"}
          </label>
          <DatePicker
            value={dateOfBirth ? new Date(dateOfBirth) : null}
            onChange={(date) => setValue("dateOfBirth", format(date, "yyyy-MM-dd"))}
            placeholder="Select Date"
          />
          {errors.dateOfBirth && <span className="text-red-500 text-[10px] mt-1">{String(errors.dateOfBirth.message || "")}</span>}
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("enrollmentDate") || "Enrollment Date"}
          </label>
          <DatePicker
            value={enrollmentDate ? new Date(enrollmentDate) : null}
            onChange={(date) => setValue("enrollmentDate", format(date, "yyyy-MM-dd"))}
            placeholder="Select Date"
          />
          {errors.enrollmentDate && <span className="text-red-500 text-[10px] mt-1">{String(errors.enrollmentDate.message || "")}</span>}
        </div>
      </div>
    </div>
  );
}
