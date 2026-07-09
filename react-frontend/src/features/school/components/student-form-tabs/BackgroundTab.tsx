import React from "react";
import { StudentFormTabProps } from "./StudentFormSchema";

export default function BackgroundTab({
  form,
  usersData,
  usersLoading,
}: StudentFormTabProps) {
  const { register, watch } = form;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ID Poor Section */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isIdPoor"
            {...register("isIdPoor")}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="isIdPoor" className="text-sm font-bold text-gray-900 dark:text-white">
            Has ID Poor Card
          </label>
        </div>

        {watch("isIdPoor") && (
          <div className="ml-8 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID Poor Number
            </label>
            <input
              {...register("idPoorNumber")}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
              placeholder="Enter ID Poor Number..."
            />
          </div>
        )}
      </div>

      {/* Outreach Worker Section */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="broughtByOutreachWorker"
            {...register("broughtByOutreachWorker")}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="broughtByOutreachWorker" className="text-sm font-bold text-gray-900 dark:text-white">
            Brought by Outreach Worker
          </label>
        </div>

        {watch("broughtByOutreachWorker") && (
          <div className="ml-8 space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outreach Worker Name
              </label>
              {usersLoading ? (
                <div className="text-sm text-gray-500">Loading users...</div>
              ) : (
                <select
                  {...register("outreachWorkerName")}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                >
                  <option value="">Select an outreach worker...</option>
                  {usersData?.map((u: any) => (
                    <option key={u.id} value={`${u.firstName} ${u.lastName}`}>
                      {u.firstName} {u.lastName} {u.userName ? `(${u.userName})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outreach Organization
              </label>
              <input
                {...register("outreachOrganization")}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                placeholder="Organization name..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
