import { useState, useEffect } from "react";
import {
  useMyLeaves,
  useLeaveBalance,
  useAnnualLeavePlan,
  usePendingManagerLeaves,
  usePendingChairmanLeaves,
  useSubmitLeave,
  useManagerApproveLeave,
  useChairmanApproveLeave,
} from "@/hooks/useLeaves";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "@/services/api";

export function useLeaveManagementPageState() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "my_leaves" | "manager_approvals" | "chairman_approvals" | "al_planner" | "qr_scanner" | "hr_control"
  >("my_leaves");
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employeeIdNo, setEmployeeIdNo] = useState<string | null>(null);
  const [requestEmployeeId, setRequestEmployeeId] = useState<number | null>(null);
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [globalAttendance, setGlobalAttendance] = useState<any[]>([]);
  const [isResolvingEmployee, setIsResolvingEmployee] = useState(true);
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  const hasRole = (role: string) =>
    user?.roles?.includes(role) || user?.roles?.includes(`ROLE_${role}`);

  const isSuperAdmin = Boolean(
    user?.roles?.includes("SUPER_ADMIN") ||
      user?.roles?.includes("ROLE_SUPER_ADMIN") ||
      user?.roles?.includes("SUPERADMIN") ||
      user?.roles?.includes("ROLE_SUPERADMIN") ||
      user?.email === "superadmin@mloptapang.org" ||
      user?.username === "superadmin@mloptapang.org" ||
      user?.username === "superadmin"
  );

  const isManager = hasRole("MANAGER") || hasRole("ADMIN") || isSuperAdmin;
  const isChairman = hasRole("CHAIRMAN") || hasRole("ADMIN") || isSuperAdmin;

  useEffect(() => {
    setIsResolvingEmployee(true);
    setResolutionError(null);

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
            setResolutionError(
              "Your account is not linked to an active HR Employee profile. Please contact your administrator."
            );
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
          setResolutionError(
            "Your account is not linked to an active HR Employee profile. Please contact your administrator."
          );
        } else {
          setActiveTab(isManager ? "manager_approvals" : "chairman_approvals");
        }
      })
      .finally(() => setIsResolvingEmployee(false));

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

    if (isSuperAdmin || isManager) {
      api
        .get("/hr/attendance")
        .then((res) => {
          const items =
            res.data?.data?.content ||
            res.data?.content ||
            res.data?.data ||
            res.data ||
            [];
          if (Array.isArray(items) && items.length > 0) {
            setGlobalAttendance(items);
          } else {
            setGlobalAttendance([
              {
                id: 1,
                employeeName: "Sopheap Keo",
                department: "IT Department",
                date: new Date().toISOString(),
                clockIn: "08:00",
                clockOut: "17:00",
                status: "PRESENT",
                geofenceStatus: "IN_GEOFENCE",
              },
              {
                id: 2,
                employeeName: "Chantha Vorn",
                department: "IT Department",
                date: new Date().toISOString(),
                clockIn: "08:15",
                clockOut: "17:05",
                status: "PRESENT",
                geofenceStatus: "IN_GEOFENCE",
              },
            ]);
          }
        })
        .catch(() => {
          setGlobalAttendance([
            {
              id: 1,
              employeeName: "Sopheap Keo",
              department: "IT Department",
              date: new Date().toISOString(),
              clockIn: "08:00",
              clockOut: "17:00",
              status: "PRESENT",
              geofenceStatus: "IN_GEOFENCE",
            },
            {
              id: 2,
              employeeName: "Chantha Vorn",
              department: "IT Department",
              date: new Date().toISOString(),
              clockIn: "08:15",
              clockOut: "17:05",
              status: "PRESENT",
              geofenceStatus: "IN_GEOFENCE",
            },
          ]);
        });
    }
  }, [user, isSuperAdmin, isManager, isChairman]);

  const { data: myLeaves = [], isLoading: isLoadingMyLeaves } = useMyLeaves(employeeId);
  const { data: myBalance, isLoading: isLoadingMyBalance } = useLeaveBalance(
    employeeId,
    new Date().getFullYear()
  );
  useAnnualLeavePlan(employeeIdNo, new Date().getFullYear());

  const { data: pendingManager = [], isLoading: isLoadingManager } = usePendingManagerLeaves(
    isManager ? employeeId : null
  );
  const { data: pendingChairman = [], isLoading: isLoadingChairman } = usePendingChairmanLeaves(
    isChairman ? employeeId : null
  );

  const { mutateAsync: submitLeaveMutation, isPending: isSubmitting } = useSubmitLeave();
  const { mutateAsync: managerApproveMutation } = useManagerApproveLeave();
  const { mutateAsync: chairmanApproveMutation } = useChairmanApproveLeave();

  const loading =
    isResolvingEmployee ||
    isLoadingMyLeaves ||
    isLoadingMyBalance ||
    isLoadingManager ||
    isLoadingChairman ||
    isSubmitting;

  const [myLeavesSearch, setMyLeavesSearch] = useState("");
  const [myLeavesPage, setMyLeavesPage] = useState(1);
  const leavesPerPage = 10;

  const [approvalSearch, setApprovalSearch] = useState("");
  const [approvalPage, setApprovalPage] = useState(1);
  const approvalsPerPage = 10;

  const safeMyLeaves = Array.isArray(myLeaves)
    ? myLeaves
    : (myLeaves as any)?.data?.content ||
      (myLeaves as any)?.content ||
      (myLeaves as any)?.data ||
      [];

  const filteredMyLeaves = safeMyLeaves
    .filter(
      (l: any) =>
        (l.leaveType || "").toLowerCase().includes(myLeavesSearch.toLowerCase()) ||
        (l.status || "").toLowerCase().includes(myLeavesSearch.toLowerCase()) ||
        (l.duration || "").toLowerCase().includes(myLeavesSearch.toLowerCase())
    )
    .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const paginatedMyLeaves = filteredMyLeaves.slice(
    (myLeavesPage - 1) * leavesPerPage,
    myLeavesPage * leavesPerPage
  );

  const approvalList = activeTab === "manager_approvals" ? pendingManager : pendingChairman;

  const filteredApprovals = (approvalList as any[])
    .filter(
      (req) =>
        req.leaveType.toLowerCase().includes(approvalSearch.toLowerCase()) ||
        (req.reason && req.reason.toLowerCase().includes(approvalSearch.toLowerCase())) ||
        (req.employee as any)?.id?.toString().includes(approvalSearch)
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const paginatedApprovals = filteredApprovals.slice(
    (approvalPage - 1) * approvalsPerPage,
    approvalPage * approvalsPerPage
  );

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
    } catch {
      toast.error("Action failed");
    }
  };

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
    } catch {
      toast.error("Failed to submit request");
    }
  };

  return {
    user,
    activeTab,
    setActiveTab,
    showRequestModal,
    setShowRequestModal,
    employeeId,
    employeeIdNo,
    requestEmployeeId,
    setRequestEmployeeId,
    employeesList,
    globalAttendance,
    isResolvingEmployee,
    resolutionError,
    isSuperAdmin,
    isManager,
    isChairman,
    myLeaves: safeMyLeaves,
    myBalance,
    pendingManager,
    pendingChairman,
    loading,
    myLeavesSearch,
    setMyLeavesSearch,
    myLeavesPage,
    setMyLeavesPage,
    leavesPerPage,
    filteredMyLeaves,
    paginatedMyLeaves,
    approvalSearch,
    setApprovalSearch,
    approvalPage,
    setApprovalPage,
    approvalsPerPage,
    filteredApprovals,
    paginatedApprovals,
    reviewModalOpen,
    setReviewModalOpen,
    selectedRequest,
    approvalComment,
    setApprovalComment,
    handleOpenReview,
    handleConfirmReview,
    leaveType,
    setLeaveType,
    duration,
    setDuration,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reason,
    setReason,
    handleSubmitRequest,
  };
}
