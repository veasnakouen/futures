import React from "react";
import { StudentFormTabProps, FormValues } from "./StudentFormSchema";
import AddressFields from "../../../../components/common/AddressFields";

export default function ContactPlacementTab({
  form,
  t,
  branchesData,
}: StudentFormTabProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("studentPhone")}
        </label>
        <input
          {...register("studentPhone")}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="+855 12 345 678"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t("currentAddress")}</h4>
        <AddressFields<FormValues> register={register} errors={errors} prefix="currentAddress" watch={watch} setValue={setValue} />
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t("permanentAddress")}</h4>
        <AddressFields<FormValues> register={register} errors={errors} prefix="permanentAddress" watch={watch} setValue={setValue} />
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-white pt-2 border-t">{t("placement")}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("branch")}
          </label>
          <select
            {...register("branchId")}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("selectBranch")}</option>
            {(branchesData?.content || (Array.isArray(branchesData) ? branchesData : [])).map((branch: any) => (
              <option key={branch.id} value={branch.id}>{branch.branchName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("classroomId")}
          </label>
          <input
            {...register("classroomId")}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("dormitoryId")}
          </label>
          <input
            {...register("dormitoryId")}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}