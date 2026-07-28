import React from "react";
import { StudentFormTabProps, FormValues } from "./StudentFormSchema";
import AddressFields from "../../../../components/common/AddressFields";

export default function ContactPlacementTab({
  form,
  t = (k) => k,
  branchesData = [],
}: StudentFormTabProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
          {t("phoneNumber") || "Phone Number"}
        </label>
        <input
          {...register("phoneNumber" as any)}
          className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-10 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="+855 12 345 678"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">{t("address") || "Address Details"}</h4>
        <AddressFields<FormValues> register={register} errors={errors} prefix={"address" as any} watch={watch} setValue={setValue} />
      </div>

      <h3 className="text-xs font-bold text-gray-900 dark:text-white pt-2 border-t">{t("placement") || "Placement & Route"}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("branch") || "Branch"}
          </label>
          <select
            {...register("branchId" as any)}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch...</option>
            {branchesData.map((b: any) => (
              <option key={b.id} value={b.id.toString()}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("transportationRoute") || "Route"}
          </label>
          <input
            {...register("transportationRoute" as any)}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="Route Alpha"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">
            {t("dormitoryId") || "Dormitory ID"}
          </label>
          <input
            {...register("dormitoryId" as any)}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-medium h-10 px-3"
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}
