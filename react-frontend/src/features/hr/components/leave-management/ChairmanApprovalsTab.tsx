import React from "react";
import { Button } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import ModernPagination from "@/components/common/ModernPagination";
import { format } from "date-fns";

interface Props {
  state: any;
}

export default function ChairmanApprovalsTab({ state }: Props) {
  const {
    approvalSearch,
    setApprovalSearch,
    paginatedApprovals,
    filteredApprovals,
    approvalPage,
    setApprovalPage,
    approvalsPerPage,
    handleOpenReview,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="font-bold text-lg dark:text-white">Chairman Executive Approvals</h2>
            <p className="text-xs text-gray-500">Executive authorization queue for high-level leave requests</p>
          </div>
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search executive queue..."
              value={approvalSearch}
              onChange={(val: any) => setApprovalSearch(typeof val === "string" ? val : val?.target?.value || "")}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date Range</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedApprovals.map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {req.employee?.firstName ? `${req.employee.firstName} ${req.employee.lastName}` : `Employee #${req.employee?.id}`}
                  </td>
                  <td className="px-6 py-4 font-semibold text-purple-600 dark:text-purple-400">{req.leaveType}</td>
                  <td className="px-6 py-4 font-medium">
                    {format(new Date(req.startDate), "MMM dd, yyyy")} - {format(new Date(req.endDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate">{req.reason || "No reason specified"}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="xs"
                      color="purple"
                      onClick={() => handleOpenReview(req)}
                      className="rounded-lg font-bold uppercase text-[10px] px-3"
                    >
                      Authorize
                    </Button>
                  </td>
                </tr>
              ))}
              {paginatedApprovals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No pending chairman approvals in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
          <ModernPagination
            currentPage={approvalPage}
            onPageChange={setApprovalPage}
            totalItems={filteredApprovals.length}
            pageSize={approvalsPerPage}
            totalPages={Math.max(1, Math.ceil(filteredApprovals.length / approvalsPerPage))}
          />
        </div>
      </div>
    </div>
  );
}
