import React, { useState } from "react";
import { useDepartments, useReferralsByDepartments, useUpdateReferral } from "../../../hooks/useOutreach";
import { Button, Spinner, Select } from "@/lib/flowbite-compat";
import { Inbox, Filter, FileText, User } from "lucide-react";

const DepartmentInbox = () => {
  const { data: departments = [], isLoading: deptsLoading } = useDepartments();
  const [selectedDeptIds, setSelectedDeptIds] = useState<number[]>([]);

  const { data: referrals = [], isLoading: referralsLoading } = useReferralsByDepartments(selectedDeptIds);
  const updateReferral = useUpdateReferral();

  const toggleDepartment = (id: number) => {
    setSelectedDeptIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleUpdateStatus = async (referralId: string, newStatus: string, originalRef: any) => {
    await updateReferral.mutateAsync({
      referralId,
      data: { ...originalRef, status: newStatus }
    });
  };

  if (deptsLoading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Inbox className="text-blue-500" /> Department Inbox
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" /> Filter by Departments:
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept: any) => {
              const isSelected = selectedDeptIds.includes(dept.id);
              return (
                <button
                  key={dept.id}
                  onClick={() => toggleDepartment(dept.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                >
                  {dept.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedDeptIds.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 text-gray-500">
            Select one or more departments above to view assigned referrals.
          </div>
        ) : referralsLoading ? (
          <div className="flex justify-center p-8"><Spinner /></div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 text-gray-500">
            No referrals found for the selected departments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {referrals.map((ref: any) => (
              <div key={ref.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-2">
                      {ref.department?.name}
                    </span>
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-lg">
                      Ticket #{ref.id?.substring(0, 8)}
                    </div>
                  </div>
                  <Select sizing="sm" value={ref.status} onChange={(e) => handleUpdateStatus(ref.id, e.target.value, ref)}>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Resolved">Resolved</option>
                  </Select>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex gap-2">
                    <User className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Assigned To</p>
                      <p>{ref.assignedTo || "Unassigned"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <FileText className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div className="w-full">
                      <p className="font-medium text-gray-900 dark:text-white">Coordinator Notes</p>
                      <p className="whitespace-pre-wrap">{ref.notes || "No notes provided."}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">Department Specific Data (JSON)</p>
                      <Button size="xs" color="light" onClick={() => {
                        const attrEl = document.getElementById(`attr-${ref.id}`) as HTMLTextAreaElement;
                        if (attrEl) {
                          updateReferral.mutateAsync({
                            referralId: ref.id,
                            data: { ...ref, customAttributes: attrEl.value }
                          });
                        }
                      }}>Save Data</Button>
                    </div>
                    <textarea
                      id={`attr-${ref.id}`}
                      className="w-full text-xs font-mono border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
                      rows={4}
                      defaultValue={ref.customAttributes || "{\n  \n}"}
                      placeholder='{ "IEP_Status": "Draft" }'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentInbox;
