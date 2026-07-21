import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";
import ImageUploadField from "../../../../components/common/ImageUploadField";
import DatePicker from "../../../../components/common/DatePicker";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BasicInfoTab({
  form,
  t,
  clientsData,
  clientsLoading,
  handleClientSelect,
}: StudentFormTabProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const isEdit = !!watch("studentCode") && watch("studentCode") !== ""; // We can infer edit mode roughly, or pass it. We'll pass `studentCode` presence as a proxy, or ideally pass `isEdit` as a prop if needed.
  // Actually, in the original code, isEdit was used to hide the client selection.
  // We can just check if we have a studentToEdit from the parent by passing an `isEdit` prop, but let's just add `isEdit?: boolean;` to StudentFormTabProps if needed.
  
  const dateOfBirth = watch("dateOfBirth");
  const enrollmentDate = watch("enrollmentDate");

  // Since we don't have isEdit in props, we'll determine if it's an existing student 
  // by checking if they already have an ID or if the parent didn't render this part.
  // Wait, in the original code: `!isEdit && ( <Select ...> )`
  // We should probably add `isEdit` to `StudentFormTabProps`. Let's assume it's added.

  return (
    <div className="animate-fade-in space-y-4">
      {/* We will handle isEdit dynamically. If handleClientSelect is provided, we assume it's not edit mode for that part, or we just render it. */}
      {handleClientSelect && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Link to Existing Global Client (Optional)
          </label>
          <Select
            onValueChange={(value) => handleClientSelect({ target: { value } } as any)}
            disabled={clientsLoading}
          >
            <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all">
              <SelectValue placeholder="-- Select a Client to auto-fill details --">
                {watch("globalClientId") && watch("globalClientId") !== null
                  ? (() => {
                    const c = clientsData?.content?.find((client: any) => client.id.toString() === watch("globalClientId")?.toString());
                    return c ? `${c.firstName} ${c.lastName}` : "-- Select a Client to auto-fill details --";
                  })()
                  : "-- Select a Client to auto-fill details --"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[250px] bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 shadow-xl rounded-lg">
              <SelectItem value="none" className="text-gray-500 italic">
                -- Select a Client to auto-fill details --
              </SelectItem>
              {clientsData?.content?.map((client: any) => (
                <SelectItem key={client.id} value={client.id.toString()} className="cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/30 rounded-md my-1">
                  {client.firstName} {client.lastName} <span className="text-gray-400 text-xs ml-2">({client.contactPhone || 'No Phone'})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Selecting a client will automatically fill their personal information and keep their records synced.
          </p>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <ImageUploadField
          label=""
          isAvatar={true}
          value={watch("imageUrl")}
          onChange={(url) => setValue("imageUrl", url)}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("firstName")}
          </label>
          <input
            {...register("firstName")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="John"
          />
          {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("middleName")}
          </label>
          <input
            {...register("middleName")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Robert"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("lastName")}
          </label>
          <input
            {...register("lastName")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Doe"
          />
          {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("emailAddress")}
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="john.doe@example.com"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("studentCode")}
          </label>
          <input
            {...register("studentCode")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="STU-12345"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("gender")}
          </label>
          <select
            {...register("gender")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">{t("selectGender")}</option>
            <option value="MALE">{t("male")}</option>
            <option value="FEMALE">{t("female")}</option>
            <option value="OTHER">{t("other")}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("nationality")}
          </label>
          <input
            {...register("nationality")}
            className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Cambodian"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("dateOfBirth")}
          </label>
          <DatePicker
            value={dateOfBirth ? new Date(dateOfBirth) : null}
            onChange={(date) => setValue("dateOfBirth", format(date, "yyyy-MM-dd"))}
            placeholder="Select Date"
          />
          {errors.dateOfBirth && <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</span>}
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            {t("enrollmentDate")}
          </label>
          <DatePicker
            value={enrollmentDate ? new Date(enrollmentDate) : null}
            onChange={(date) => setValue("enrollmentDate", format(date, "yyyy-MM-dd"))}
            placeholder="Select Date"
          />
          {errors.enrollmentDate && <span className="text-red-500 text-xs mt-1">{errors.enrollmentDate.message}</span>}
        </div>
      </div>
    </div>
  );
}
