import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import { 
  useMyLeaves, 
  useLeaveBalance, 
  usePendingManagerLeaves, 
  usePendingChairmanLeaves, 
  useSubmitLeave, 
  useManagerApproveLeave, 
  useChairmanApproveLeave 
} from "../hooks/useLeaves";
import { useAuthStore } from "../store/authStore";
import {Button, Alert, Badge, Spinner, Modal, Label, Select, TextInput, Textarea} from '@/lib/flowbite-compat';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Activity,
} from "lucide-react";
import DatePicker from "@/components/common/DatePicker";
import ModernTabs from "@/components/common/ModernTabs";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";

const LeaveManagementPage = ({ isDark, setIsDark }: any) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "my_leaves" | "manager_approvals" | "chairman_approvals"
  >("my_leaves");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mocking employee ID linking. In a real system, user.employeeId would exist.
  const [employeeId, setEmployeeId] = useState<number | null>(
    typeof (user as any)?.id === "number" ? (user as any).id : null,
  );
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [isResolvingEmployee, setIsResolvingEmployee] = useState(
    typeof (user as any)?.id !== "number",
  );

  const hasRole = (role: string) =>
    user?.roles?.includes(role) ||
    user?.roles?.includes(`ROLE_${role}`) ||
    ((user?.email === "admin@mtp.com" ||
      user?.email === "superadmin@mloptapang.org" ||
      user?.username === "admin@mtp.com") &&
      (role === "ADMIN" || role === "SUPER_ADMIN"));
  const isManager =
    hasRole("MANAGER") || hasRole("SUPER_ADMIN") || hasRole("ADMIN");
  const isChairman =
    hasRole("CHAIRMAN") || hasRole("SUPER_ADMIN") || hasRole("ADMIN");

  useEffect(() => {
    if (isManager || isChairman) {
      // Managers and Admins can select any employee
      api
        .get("/employees")
        .then((res) => {
          const employees = res.data.content || res.data;
          setEmployeesList(employees || []);
          if (employeeId === null && employees && employees.length > 0) {
            setEmployeeId(employees[0].id);
          } else if (employeeId === null) {
            setEmployeeId(1);
          }
        })
        .catch(() => {
          if (employeeId === null) setEmployeeId(1);
        })
        .finally(() => setIsResolvingEmployee(false));
    } else {
      // Normal employee: resolve their actual Employee ID from the backend
      api
        .get("/employees/me")
        .then((res) => {
          if (res.data && res.data.id) {
            setEmployeeId(res.data.id);
          } else {
            setEmployeeId(1);
          }
        })
        .catch(() => setEmployeeId(1))
        .finally(() => setIsResolvingEmployee(false));
    }
  }, [user, isManager, isChairman]);

  const { data: myLeaves = [], isLoading: isLoadingMyLeaves } = useMyLeaves(employeeId);
  const { data: myBalance, isLoading: isLoadingMyBalance } = useLeaveBalance(employeeId, new Date().getFullYear());
  
  const { data: pendingManager = [], isLoading: isLoadingManager } = usePendingManagerLeaves(isManager ? employeeId : null);
  const { data: pendingChairman = [], isLoading: isLoadingChairman } = usePendingChairmanLeaves(isChairman ? employeeId : null);

  const { mutateAsync: submitLeaveMutation, isPending: isSubmitting } = useSubmitLeave();
  const { mutateAsync: managerApproveMutation } = useManagerApproveLeave();
  const { mutateAsync: chairmanApproveMutation } = useChairmanApproveLeave();

  const loading = isResolvingEmployee || isLoadingMyLeaves || isLoadingMyBalance || isLoadingManager || isLoadingChairman || isSubmitting;

  // Request Form State
  const [leaveType, setLeaveType] = useState("Annual");
  const [duration, setDuration] = useState("FULL_DAY");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reason, setReason] = useState("");

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return toast.error("Dates are required");

    try {
      await submitLeaveMutation({
        employee: { id: employeeId || 1 },
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

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Leave Management">
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        {/* Tabs */}
        <div className="mb-6">
          <ModernTabs
            tabs={[
              { id: "my_leaves", label: "My Leaves" },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">
                    Annual Leave
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                    {myBalance
                      ? myBalance.totalAnnualLeave - myBalance.usedAnnualLeave
                      : "-"}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      days left
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Out of {myBalance?.totalAnnualLeave || 0} (Tenure-based)
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500">
                  <Calendar size={24} />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">
                    Sick Leave
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                    {myBalance
                      ? myBalance.totalSickLeave - myBalance.usedSickLeave
                      : "-"}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      days left
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-500">
                  <Activity size={24} />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">
                    Special Leave
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                    {myBalance
                      ? myBalance.totalSpecialLeave - myBalance.usedSpecialLeave
                      : "-"}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      days left
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500">
                  <FileText size={24} />
                </div>
              </div>
            </div>

            {/* History & Request */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
                <h2 className="font-bold text-lg dark:text-white">
                  Leave History
                </h2>
                <Button color="blue" onClick={() => setShowRequestModal(true)}>
                  Request Leave
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Date Range</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeaves.map((leave) => (
                      <tr
                        key={leave.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {leave.leaveType}
                        </td>
                        <td className="px-6 py-4">
                          {format(new Date(leave.startDate), "MMM dd, yyyy")} -{" "}
                          {format(new Date(leave.endDate), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4">
                          {leave.duration.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={leave.status} />
                        </td>
                      </tr>
                    ))}
                    {myLeaves.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center">
                          No leave requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Approvals */}
        {(activeTab === "manager_approvals" ||
          activeTab === "chairman_approvals") && (
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-fade-in"
            key={activeTab}
          >
            <div className="p-5 border-b bg-gray-50 dark:bg-gray-900/30">
              <h2 className="font-bold text-lg dark:text-white">
                Pending Requests
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date Range</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "manager_approvals"
                    ? pendingManager
                    : pendingChairman
                  ).map((req) => (
                    <tr
                      key={req.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        EMP-{(req.employee as any)?.id}
                      </td>
                      <td className="px-6 py-4">{req.leaveType}</td>
                      <td className="px-6 py-4">
                        {format(new Date(req.startDate), "MMM dd")} -{" "}
                        {format(new Date(req.endDate), "MMM dd")}
                      </td>
                      <td className="px-6 py-4 truncate max-w-[200px]">
                        {req.reason}
                      </td>
                      <td className="px-6 py-4 flex gap-2 justify-end">
                        <Button
                          size="xs"
                          color="success"
                          onClick={() =>
                            activeTab === "manager_approvals"
                              ? managerApproveMutation({
                                  id: req.id,
                                  managerId: employeeId as number,
                                  approved: true,
                                })
                              : chairmanApproveMutation({
                                  id: req.id,
                                  chairmanId: employeeId as number,
                                  approved: true,
                                })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() =>
                            activeTab === "manager_approvals"
                              ? managerApproveMutation({
                                  id: req.id,
                                  managerId: employeeId as number,
                                  approved: false,
                                  comment: "Rejected",
                                })
                              : chairmanApproveMutation({
                                  id: req.id,
                                  chairmanId: employeeId as number,
                                  approved: false,
                                  comment: "Rejected",
                                })
                          }
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === "manager_approvals"
                    ? pendingManager
                    : pendingChairman
                  ).length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        All caught up! No pending approvals.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Request Side Panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${showRequestModal ?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowRequestModal(false)}
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 transform flex flex-col ${showRequestModal ?"translate-x-0":"translate-x-full"}`}
        >
          <div className="p-5 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Request Time Off
            </h3>
            <button
              onClick={() => setShowRequestModal(false)}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {employeesList.length > 0 && (
                <div>
                  <Label>Staff Name</Label>
                  <Select
                    value={employeeId || ""}
                    onChange={(e) => setEmployeeId(Number(e.target.value))}
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
                <Label>Leave Type</Label>
                <Select
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
                <Label>Duration</Label>
                <Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="FULL_DAY">Full Day</option>
                  <option value="HALF_MORNING">Half Day (Morning)</option>
                  <option value="HALF_AFTERNOON">Half Day (Afternoon)</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Date</Label>
                  <DatePicker value={startDate} onChange={setStartDate} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <DatePicker value={endDate} onChange={setEndDate} />
                </div>
              </div>
              <div>
                <Label>Reason / Notes</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <Button
                type="submit"
                color="blue"
                className="w-full !mt-6"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Submit Request"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveManagementPage;
