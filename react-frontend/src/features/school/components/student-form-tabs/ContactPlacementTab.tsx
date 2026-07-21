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
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
          {t("studentPhone")}
        </label>
        <input
          {...register("studentPhone")}
          className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
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
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("branch")}
          </label>
          <select
            {...register("branchId")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">{t("selectBranch")}</option>
            {(branchesData?.content || (Array.isArray(branchesData) ? branchesData : [])).map((branch: any) => (
              <option key={branch.id} value={branch.id}>{branch.branchName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("classroomId")}
          </label>
          <input
            {...register("classroomId")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("dormitoryId")}
          </label>
          <input
            {...register("dormitoryId")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}
