import React, { useEffect, useState } from "react";

import {
  useMyLeaves,
  useLeaveBalance,
  useAnnualLeavePlan,
  usePendingManagerLeaves,
  usePendingChairmanLeaves,
  useSubmitLeave,
  useManagerApproveLeave,
  useChairmanApproveLeave
} from "../hooks/useLeaves";
import { useAuthStore } from "../store/authStore";
import { Button, Alert, Badge, Spinner, Modal, Label, Select, TextInput, Textarea } from '@/lib/flowbite-compat';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Activity,
  UserX,
} from "lucide-react";
import DatePicker from "@/components/common/DatePicker";
import ModernTabs from "@/components/common/ModernTabs";
import ModernPagination from "@/components/common/ModernPagination";
import AnnualLeavePlannerTab from "../features/hr/components/AnnualLeavePlannerTab";
import SearchInput from "@/components/common/SearchInput";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";

const LeaveManagementPage = ({ isDark, setIsDark }: any) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "my_leaves" | "manager_approvals" | "chairman_approvals" | "al_planner"
  >("my_leaves");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mocking employee ID linking. In a real system, user.employeeId would exist.
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employeeIdNo, setEmployeeIdNo] = useState<string | null>(null);
  const [requestEmployeeId, setRequestEmployeeId] = useState<number | null>(null);
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [isResolvingEmployee, setIsResolvingEmployee] = useState(true);
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  const hasRole = (role: string) =>
    user?.roles?.includes(role) ||
    user?.roles?.includes(`ROLE_${role}`);

  const isSuperAdmin = Boolean(
    user?.roles?.includes("SUPER_ADMIN") ||
    user?.roles?.includes("ROLE_SUPER_ADMIN") ||
    user?.roles?.includes("SUPERADMIN") ||
    user?.roles?.includes("ROLE_SUPERADMIN") ||
    user?.email === "superadmin@mloptapang.org" ||
    user?.username === "superadmin@mloptapang.org" ||
    user?.username === "superadmin"
  );

  const isManager =
    hasRole("MANAGER") || hasRole("ADMIN") || isSuperAdmin;
  const isChairman =
    hasRole("CHAIRMAN") || hasRole("ADMIN") || isSuperAdmin;

  useEffect(() => {
    setIsResolvingEmployee(true);
    setResolutionError(null);

    // Always fetch the current user's actual employee profile first
    api
      .get("/employees/me")
      .then((res) => {
        if (res.data && res.data.id) {
          setEmployeeId(res.data.id);
          setEmployeeIdNo(res.data.idNo);
          setRequestEmployeeId(res.data.id);
        } else {
          setEmployeeId(null);
          setEmployeeIdNo(null);
          setRequestEmployeeId(null);
          if (!isManager && !isChairman) {
            setResolutionError("Your account is not linked to an active HR Employee profile. Please contact your administrator.");
          } else {
            setActiveTab(isManager ? "manager_approvals" : "chairman_approvals");
          }
        }
      })
      .catch(() => {
        setEmployeeId(null);
        setEmployeeIdNo(null);
        setRequestEmployeeId(null);
        if (!isManager && !isChairman) {
          setResolutionError("Your account is not linked to an active HR Employee profile. Please contact your administrator.");
        } else {
          setActiveTab(isManager ? "manager_approvals" : "chairman_approvals");
        }
      })
      .finally(() => setIsResolvingEmployee(false));

    // If super admin, fetch list of all employees for the 'Request on behalf' feature
    if (isSuperAdmin) {
      api
        .get("/employees")
        .then((res) => {
          const employees = res.data.content || res.data;
          setEmployeesList(employees || []);
        })
        .catch(() => {
          setEmployeesList([]);
        });
    } else {
      setEmployeesList([]);
    }
  }, [user, isSuperAdmin, isManager, isChairman]);

  const { data: myLeaves = [], isLoading: isLoadingMyLeaves } = useMyLeaves(employeeId);
  const { data: myBalance, isLoading: isLoadingMyBalance } = useLeaveBalance(employeeId, new Date().getFullYear());
  // Prefetch Annual Leave Plan in background as soon as employeeIdNo is resolved
  useAnnualLeavePlan(employeeIdNo, new Date().getFullYear());

  const { data: pendingManager = [], isLoading: isLoadingManager } = usePendingManagerLeaves(isManager ? employeeId : null);
  const { data: pendingChairman = [], isLoading: isLoadingChairman } = usePendingChairmanLeaves(isChairman ? employeeId : null);

  const { mutateAsync: submitLeaveMutation, isPending: isSubmitting } = useSubmitLeave();
  const { mutateAsync: managerApproveMutation } = useManagerApproveLeave();
  const { mutateAsync: chairmanApproveMutation } = useChairmanApproveLeave();

  const loading = isResolvingEmployee || isLoadingMyLeaves || isLoadingMyBalance || isLoadingManager || isLoadingChairman || isSubmitting;

  // Pagination & Filter State
  const [myLeavesSearch, setMyLeavesSearch] = useState("");
  const [myLeavesPage, setMyLeavesPage] = useState(1);
  const leavesPerPage = 10;

  const [approvalSearch, setApprovalSearch] = useState("");
  const [approvalPage, setApprovalPage] = useState(1);
  const approvalsPerPage = 10;

  const filteredMyLeaves = myLeaves.filter(l =>
    l.leaveType.toLowerCase().includes(myLeavesSearch.toLowerCase()) ||
    l.status.toLowerCase().includes(myLeavesSearch.toLowerCase()) ||
    l.duration.toLowerCase().includes(myLeavesSearch.toLowerCase())
  ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const paginatedMyLeaves = filteredMyLeaves.slice((myLeavesPage - 1) * leavesPerPage, myLeavesPage * leavesPerPage);

  const approvalList = activeTab === "manager_approvals" ? pendingManager : pendingChairman;

  const filteredApprovals = approvalList.filter(req =>
    req.leaveType.toLowerCase().includes(approvalSearch.toLowerCase()) ||
    (req.reason && req.reason.toLowerCase().includes(approvalSearch.toLowerCase())) ||
    (req.employee as any)?.id?.toString().includes(approvalSearch)
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const paginatedApprovals = filteredApprovals.slice((approvalPage - 1) * approvalsPerPage, approvalPage * approvalsPerPage);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvalComment, setApprovalComment] = useState("");

  const handleOpenReview = (req: any) => {
    setSelectedRequest(req);
    setApprovalComment("");
    setReviewModalOpen(true);
  };

  const handleConfirmReview = async (approved: boolean) => {
    if (!selectedRequest) return;
    if (!approved && !approvalComment.trim()) {
      toast.error("Comment is required for rejection");
      return;
    }
    try {
      if (activeTab === "manager_approvals") {
        await managerApproveMutation({
          id: selectedRequest.id,
          managerId: employeeId as number,
          approved,
          comment: approvalComment,
        });
      } else {
        await chairmanApproveMutation({
          id: selectedRequest.id,
          chairmanId: employeeId as number,
          approved,
          comment: approvalComment,
        });
      }
      toast.success(approved ? "Leave Approved" : "Leave Rejected");
      setReviewModalOpen(false);
    } catch (e) {
      toast.error("Action failed");
    }
  };

  // Request Form State
  const [leaveType, setLeaveType] = useState("Annual");
  const [duration, setDuration] = useState("FULL_DAY");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reason, setReason] = useState("");

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return toast.error("Dates are required");
    if (endDate < startDate) return toast.error("End date cannot be earlier than start date");
    if (!employeeId) return toast.error("Please select a valid employee");

    try {
      await submitLeaveMutation({
        employee: { id: requestEmployeeId || 1 },
        leaveType,
        duration,
        startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        reason,
      });
      toast.success("Leave Request Submitted!");
      setShowRequestModal(false);
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "APPROVED")
      return (
        <Badge color="success" icon={CheckCircle}>
          Approved
        </Badge>
      );
    if (status === "REJECTED")
      return (
        <Badge color="failure" icon={XCircle}>
          Rejected
        </Badge>
      );
    return (
      <Badge color="warning" icon={Clock}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (resolutionError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center animate-fade-in flex flex-col items-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6">
            <UserX className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Unlinked Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {resolutionError}
          </p>
          <Button
            onClick={() => window.location.href = "/"}
            className="w-full h-12 font-bold rounded-xl"
            color="gray"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in pb-24">
        {/* Tabs */}
        <div className="mb-6">
          <ModernTabs
            tabs={[
              ...(employeeId ? [
                { id: "my_leaves", label: "My Leaves" },
                { id: "al_planner", label: "AL Planner" },
              ] : []),
              ...(isManager
                ? [
                  {
                    id: "manager_approvals",
                    label: `Manager Approvals ${pendingManager.length > 0 ? `(${pendingManager.length})` : ""}`,
                  },
                ]
                : []),
              ...(isChairman
                ? [
                  {
                    id: "chairman_approvals",
                    label: `Chairman Approvals ${pendingChairman.length > 0 ? `(${pendingChairman.length})` : ""}`,
                  },
                ]
                : []),
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
          />
        </div>

        {/* My Leaves Tab */}
        {activeTab === "my_leaves" && (
          <div className="space-y-6 animate-fade-in" key="my_leaves">
            {/* Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Annual Leave */}
              <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Calendar size={64} className="text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4 flex items-center gap-2">
                    <Calendar size={14} /> Annual Leave
                  </div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                    {myBalance ? myBalance.totalAnnualLeave - myBalance.usedAnnualLeave : "-"}{" "}
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Left</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 mb-3">
                    Out of {myBalance?.totalAnnualLeave || 0} total days
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${myBalance && myBalance.totalAnnualLeave > 0 ? (myBalance.usedAnnualLeave / myBalance.totalAnnualLeave) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 text-right">{myBalance?.usedAnnualLeave || 0} used</div>
                </div>
              </div>

              {/* Sick Leave */}
              <div className="bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-red-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Activity size={64} className="text-red-500" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black tracking-widest text-red-600 dark:text-red-400 uppercase mb-4 flex items-center gap-2">
                    <Activity size={14} /> Sick Leave
                  </div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                    {myBalance ? myBalance.totalSickLeave - myBalance.usedSickLeave : "-"}{" "}
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Left</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 mb-3">
                    Out of {myBalance?.totalSickLeave || 0} total days
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-red-500 h-1.5 rounded-full"
                      style={{ width: `${myBalance && myBalance.totalSickLeave > 0 ? (myBalance.usedSickLeave / myBalance.totalSickLeave) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 text-right">{myBalance?.usedSickLeave || 0} used</div>
                </div>
              </div>

              {/* Special Leave */}
              <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-purple-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <FileText size={64} className="text-purple-500" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-4 flex items-center gap-2">
                    <FileText size={14} /> Special Leave
                  </div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                    {myBalance ? myBalance.totalSpecialLeave - myBalance.usedSpecialLeave : "-"}{" "}
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Left</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 mb-3">
                    Out of {myBalance?.totalSpecialLeave || 0} total days
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${myBalance && myBalance.totalSpecialLeave > 0 ? (myBalance.usedSpecialLeave / myBalance.totalSpecialLeave) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 text-right">{myBalance?.usedSpecialLeave || 0} used</div>
                </div>
              </div>

              {/* Other Leave / Unpaid */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Clock size={64} className="text-gray-500" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black tracking-widest text-gray-600 dark:text-gray-400 uppercase mb-4 flex items-center gap-2">
                    <Clock size={14} /> Other Leave
                  </div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                    {myLeaves.filter(l => l.leaveType === "Unpaid").length}{" "}
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Taken</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 mb-3">
                    Unpaid or Off-in-Lieu
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                    <div className="bg-gray-400 h-1.5 rounded-full w-full opacity-50" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 text-right">No limit</div>
                </div>
              </div>
            </div>

            {/* History & Request */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
                <h2 className="font-bold text-lg dark:text-white">
                  Leave History
                </h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-full sm:w-64">
                    <SearchInput
                      placeholder="Search leaves..."
                      value={myLeavesSearch}
                      onChange={setMyLeavesSearch}
                    />
                  </div>
                  <Button color="blue" onClick={() => setShowRequestModal(true)} className="shrink-0 font-bold tracking-wide border-none bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Request Leave
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Date Range</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {paginatedMyLeaves.map((leave) => (
                      <tr
                        key={leave.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          {leave.leaveType}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {format(new Date(leave.startDate), "MMM dd, yyyy")} -{" "}
                          {format(new Date(leave.endDate), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {leave.duration.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={leave.status} />
                        </td>
                      </tr>
                    ))}
                    {paginatedMyLeaves.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                          No leave requests found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredMyLeaves.length > leavesPerPage && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
                  <ModernPagination
                    currentPage={myLeavesPage}
                    onPageChange={setMyLeavesPage}
                    totalItems={filteredMyLeaves.length}
                    pageSize={leavesPerPage}
                    totalPages={Math.ceil(filteredMyLeaves.length / leavesPerPage)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* AL Planner Tab */}
        <div className={activeTab === "al_planner" ? "block" : "hidden"}>
          <AnnualLeavePlannerTab 
            employeeId={employeeId} 
            employeeIdNo={employeeIdNo} 
          />
        </div>

        {/* Approvals */}
        {(activeTab === "manager_approvals" ||
          activeTab === "chairman_approvals") && (
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in"
              key={activeTab}
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
                <h2 className="font-bold text-lg dark:text-white">
                  Pending Requests
                </h2>
                <div className="w-full sm:w-64">
                  <SearchInput
                    placeholder="Search by ID or type..."
                    value={approvalSearch}
                    onChange={setApprovalSearch}
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
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {paginatedApprovals.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          EMP-{(req.employee as any)?.id}
                        </td>
                        <td className="px-6 py-4 font-medium">{req.leaveType}</td>
                        <td className="px-6 py-4 font-medium">
                          {format(new Date(req.startDate), "MMM dd")} -{" "}
                          {format(new Date(req.endDate), "MMM dd")}
                        </td>
                        <td className="px-6 py-4 truncate max-w-[200px]">
                          {req.reason}
                        </td>
                        <td className="px-6 py-4 flex gap-2 justify-end">
                          <Button
                            size="xs"
                            color="blue"
                            className="font-bold border-none"
                            onClick={() => handleOpenReview(req)}
                          >
                            Review Request
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {paginatedApprovals.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-gray-400 font-medium"
                        >
                          All caught up! No pending approvals.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredApprovals.length > approvalsPerPage && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
                  <ModernPagination
                    currentPage={approvalPage}
                    onPageChange={setApprovalPage}
                    totalItems={filteredApprovals.length}
                    pageSize={approvalsPerPage}
                    totalPages={Math.ceil(filteredApprovals.length / approvalsPerPage)}
                  />
                </div>
              )}
            </div>
          )}
      </div>

      {/* Request Side Panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${showRequestModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowRequestModal(false)}
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 transform flex flex-col ${showRequestModal ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/80 dark:bg-gray-900/50">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              Request Time Off
            </h3>
            <button
              onClick={() => setShowRequestModal(false)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-100 dark:border-gray-700"
            >
              <XCircle size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <form onSubmit={handleSubmitRequest} className="space-y-5">
              {isSuperAdmin && employeesList.length > 0 && (
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                    Staff Name (Super Admin On-Behalf Request)
                  </Label>
                  <Select
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4"
                    value={requestEmployeeId || ""}
                    onChange={(e) => setRequestEmployeeId(Number(e.target.value))}
                    required
                  >
                    {employeesList.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstNameEnglish} {emp.lastNameEnglish} (EMP-
                        {emp.id})
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Leave Type</Label>
                <Select
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Special">Special Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Duration</Label>
                <Select
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="FULL_DAY">Full Day</option>
                  <option value="HALF_MORNING">Half Day (Morning)</option>
                  <option value="HALF_AFTERNOON">Half Day (Afternoon)</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Start Date</Label>
                  <DatePicker value={startDate} onChange={setStartDate} />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">End Date</Label>
                  <DatePicker value={endDate} onChange={setEndDate} />
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Reason / Notes</Label>
                <Textarea
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm p-4 resize-none"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Provide context for your manager..."
                  required
                />
              </div>
              {requestEmployeeId === null && employeesList.length === 0 && (
                <Alert color="failure" className="mb-4 border-none rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <UserX size={16} />
                    <span>No active employees available to select.</span>
                  </div>
                </Alert>
              )}
              <Button
                type="submit"
                color="blue"
                className="w-full !mt-8 h-12 text-sm font-bold tracking-wide rounded-xl border-none shadow-lg shadow-blue-500/20"
                disabled={loading || requestEmployeeId === null}
              >
                {loading ? <Spinner size="sm" /> : "Submit Request"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Review Request Modal */}
      <Modal show={reviewModalOpen} onClose={() => setReviewModalOpen(false)} size="md">
        <Modal.Header className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <span className="font-black text-lg text-gray-900 dark:text-white">Review Leave Request</span>
        </Modal.Header>
        <Modal.Body className="pt-4">
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employee</span>
                  <span className="font-bold text-gray-900 dark:text-white">EMP-{(selectedRequest.employee as any)?.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</span>
                  <Badge color="blue">{selectedRequest.leaveType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedRequest.duration.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dates</span>
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {format(new Date(selectedRequest.startDate), "MMM dd")} - {format(new Date(selectedRequest.endDate), "MMM dd")}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Reason</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    {selectedRequest.reason}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Manager Comment (Required if rejecting)</Label>
                <Textarea
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm p-4"
                  placeholder="Add a note..."
                  value={approvalComment}
                  onChange={e => setApprovalComment(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-100 dark:border-gray-700 gap-3 pt-4">
          <Button color="gray" onClick={() => setReviewModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 border-none text-gray-700 font-bold rounded-xl h-11">
            Cancel
          </Button>
          <Button color="failure" onClick={() => handleConfirmReview(false)} className="flex-1 font-bold rounded-xl h-11">
            Reject Request
          </Button>
          <Button color="success" onClick={() => handleConfirmReview(true)} className="flex-1 font-bold rounded-xl h-11">
            Approve Leave
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveManagementPage;
