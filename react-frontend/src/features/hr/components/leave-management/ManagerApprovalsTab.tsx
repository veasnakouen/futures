import React from "react";
import { Button, Modal, ModalBody, Textarea, Label } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import ModernPagination from "@/components/common/ModernPagination";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { CheckCircle, XCircle, Shield } from "lucide-react";
import { format } from "date-fns";

interface Props {
  state: any;
}

export default function ManagerApprovalsTab({ state }: Props) {
  const {
    approvalSearch,
    setApprovalSearch,
    paginatedApprovals,
    filteredApprovals,
    approvalPage,
    setApprovalPage,
    approvalsPerPage,
    reviewModalOpen,
    setReviewModalOpen,
    selectedRequest,
    approvalComment,
    setApprovalComment,
    handleOpenReview,
    handleConfirmReview,
  } = state;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="font-bold text-lg dark:text-white">Manager Leave Approvals</h2>
            <p className="text-xs text-gray-500">Authorize time-off requests submitted by your team members</p>
          </div>
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search team requests..."
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
                  <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{req.leaveType}</td>
                  <td className="px-6 py-4 font-medium">
                    {format(new Date(req.startDate), "MMM dd, yyyy")} - {format(new Date(req.endDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate">{req.reason || "No reason specified"}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => handleOpenReview(req)}
                      className="rounded-lg font-bold uppercase text-[10px] px-3"
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
              {paginatedApprovals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No pending manager approvals found.
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

      {/* Review Modal Dialog */}
      {reviewModalOpen && selectedRequest && (
        <Modal show={reviewModalOpen} onClose={() => setReviewModalOpen(false)} size="md">
          <CustomModalHeader
            title="Review Manager Approval"
            subtitle={`Authorization for ${selectedRequest.employee?.firstName || "Employee"}`}
            icon={<Shield className="w-5 h-5 text-indigo-500" />}
            onClose={() => setReviewModalOpen(false)}
          />
          <ModalBody className="p-6 space-y-4">
            <div className="space-y-2 text-xs font-bold text-gray-700 dark:text-gray-200">
              <p><span className="text-gray-400 uppercase tracking-wider">Leave Type:</span> {selectedRequest.leaveType}</p>
              <p><span className="text-gray-400 uppercase tracking-wider">Dates:</span> {format(new Date(selectedRequest.startDate), "MMM dd, yyyy")} - {format(new Date(selectedRequest.endDate), "MMM dd, yyyy")}</p>
              <p><span className="text-gray-400 uppercase tracking-wider">Reason:</span> {selectedRequest.reason || "N/A"}</p>
            </div>
            <div>
              <Label value="Manager Decision Notes / Comments" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
              <Textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Optional notes for approval or mandatory explanation for rejection..."
                rows={3}
              />
            </div>
          </ModalBody>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 rounded-b-2xl">
            <Button color="failure" onClick={() => handleConfirmReview(false)} className="rounded-xl font-bold">
              <XCircle size={16} className="mr-1" /> Reject
            </Button>
            <Button color="success" onClick={() => handleConfirmReview(true)} className="rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle size={16} className="mr-1" /> Approve
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
