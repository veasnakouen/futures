import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Spinner } from '@/lib/flowbite-compat';
import {
  Users,
  Clock,
  Calendar,
  LayoutGrid,
  List,
  Building2,
  Activity,
  Award,
  Monitor,
  Zap,
  Settings,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Plus,
  FileText,
  CalendarCheck,
  Package,
  UserPlus,
  Briefcase,
  Server,
} from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Layout from "@/components/common/Layout";
import api from "../services/api";
import { subDays, addDays } from "date-fns";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeSchema,
  type EmployeeFormData,
} from "../schemas/employeeSchema";
import ConfirmModal from "@/components/common/ConfirmModal";

// Modular Components
import WorkforceDirectory from "@/features/hr/components/WorkforceDirectory";
import AttendanceModule from "@/features/hr/components/AttendanceModule";
import LeavesModule from "@/features/hr/components/LeavesModule";
import AnalyticsModule from "@/features/hr/components/AnalyticsModule";
import PayrollModule from "@/features/hr/components/PayrollModule";
import AssetsModule from "@/features/hr/components/AssetsModule";
import RecruitmentModule from "@/features/hr/components/RecruitmentModule";
import StructureModule from "@/features/hr/components/StructureModule";
import TrainingModule from "@/features/hr/components/TrainingModule";
import ComplianceModule from "@/features/hr/components/ComplianceModule";
import TimeOffOverview from "@/features/hr/components/TimeOffOverview";
import IntegrationModule from "@/features/hr/components/IntegrationModule";
import AutomationModule from "@/features/hr/components/AutomationModule";
import EngagementModule from "@/features/hr/components/EngagementModule";
import PortalModule from "@/features/hr/components/PortalModule";
import ManagerModule from "@/features/hr/components/ManagerModule";
import SchedulingModule from "@/features/hr/components/SchedulingModule";
import RetentionModule from "@/features/hr/components/RetentionModule";
import SuccessionModule from "@/features/hr/components/SuccessionModule";
import SupportModule from "@/features/hr/components/SupportModule";
import ReportsModule from "@/features/hr/components/ReportsModule";
import WellnessModule from "@/features/hr/components/WellnessModule";
import EmployeeRegistrationModal from "@/features/hr/components/EmployeeRegistrationModal";
import EmployeeDetailModal from "@/features/hr/components/EmployeeDetailModal";
import AnalyticsModal from "@/features/hr/components/AnalyticsModal";
import ManualAttendanceModal from "@/features/hr/components/ManualAttendanceModal";
import BiometricDeviceModal from "@/features/hr/components/BiometricDeviceModal";
import { useHRStore } from "../store/hrStore";

const EmployeesPage = ({ isDark, setIsDark }: any) => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("hr_viewMode");
    return (saved as "grid" | "list") || "grid";
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Page Module State
  const [activeModule, setActiveModule] = useState<
    | "directory"
    | "attendance"
    | "leaves"
    | "timeoff"
    | "analytics"
    | "payroll"
    | "assets"
    | "stock"
    | "recruitment"
    | "structure"
    | "training"
    | "compliance"
    | "portal"
    | "manager"
    | "scheduling"
    | "retention"
    | "succession"
    | "wellness"
    | "automation"
    | "engagement"
    | "integrations"
    | "support"
    | "reports"
  >(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("hr_activeModule");
    return (saved as any) || "directory";
  });

  useEffect(() => {
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("hr_viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("hr_activeModule", activeModule);
  }, [activeModule]);

  // Infinite Query for Employees
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: [
      "employees",
      search,
      deptFilter,
      statusFilter,
      contractFilter,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const response = await api.get(`/employees`, {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: search,
          dept: deptFilter,
          status: statusFilter,
          contract: contractFilter,
        },
      });
      return response.data;
    },
  });

  const employees = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newEmployee: any) => api.post("/employees", newEmployee),
    onSuccess: (response) => {
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: [
              {
                ...response.data,
                departmentName: response.data.department?.name,
                positionName: response.data.position?.name,
              },
              ...oldData.content,
            ],
            totalElements: (oldData.totalElements || 0) + 1,
          };
        },
      );
      toast.success("New staff onboarded successfully");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataStr = error.response?.data
        ? JSON.stringify(error.response.data)
        : "No data";
      toast.error(`Create Error ${status}: ${dataStr} - ${error.message}`);
      console.error("Create Mutation Error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/employees/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: oldData.content.map((emp: any) =>
              emp.id === variables.id
                ? {
                    ...emp,
                    ...response.data,
                    departmentName: response.data.department?.name,
                    positionName: response.data.position?.name,
                  }
                : emp,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Personnel record synchronized successfully");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const dataStr = error.response?.data
        ? JSON.stringify(error.response.data)
        : "No data";
      toast.error(`Update Error ${status}: ${dataStr} - ${error.message}`);
      console.error("Update Mutation Error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/employees/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: oldData.content.filter((emp: any) => emp.id !== id),
            totalElements: Math.max(0, (oldData.totalElements || 1) - 1),
          };
        },
      );
      toast.success("Personnel record decommissioned");
    },
  });

  const salaryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/employees/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: oldData.content.map((emp: any) =>
              emp.id === variables.id
                ? {
                    ...emp,
                    ...response.data,
                    departmentName: response.data.department?.name,
                    positionName: response.data.position?.name,
                  }
                : emp,
            ),
          };
        },
      );
      toast.success("Salary adjusted successfully");
    },
  });

  // Modals & Selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<
    "profile" | "attendance" | "leave" | "performance" | "payroll" | "assets"
  >("profile");
  const [isManualAttendanceOpen, setIsManualAttendanceOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // Import from Users
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCandidates, setImportCandidates] = useState<any[]>([]);
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importFetching, setImportFetching] = useState(false);

  const fetchLinkCandidates = async () => {
    setImportFetching(true);
    try {
      const res = await api.get("/employees/link-candidates");
      setImportCandidates(res.data || []);
    } catch (error: any) {
      console.error("Import candidates fetch error:", error);
      toast.error(
        `Failed to load candidates (${error?.response?.status || "Network Error"})`,
      );
    } finally {
      setImportFetching(false);
    }
  };

  const openImportModal = () => {
    setSelectedImportIds([]);
    setIsImportModalOpen(true);
    fetchLinkCandidates();
  };

  const toggleImportSelect = (id: string) => {
    setSelectedImportIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleImportUsers = async () => {
    if (selectedImportIds.length === 0) return;
    setImportLoading(true);
    const selected = importCandidates.filter((c) =>
      selectedImportIds.includes(c.id),
    );
    let successCount = 0;
    let failCount = 0;
    for (const user of selected) {
      try {
        await api.post("/employees", {
          firstNameEnglish: user.firstName || "Unknown",
          lastNameEnglish: user.lastName || "User",
          email: user.email,
          idNo: `USR-${user.userName || user.id.substring(0, 8)}`,
          title: "Mr",
          status: "Active",
          contractType: "Full-Time",
          photo: user.avatarUrl || null,
          joinDate: new Date().toISOString().substring(0, 10),
          note: `Imported from system user account @${user.userName}`,
        });
        successCount++;
      } catch {
        failCount++;
      }
    }
    setImportLoading(false);
    setIsImportModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    if (successCount > 0)
      toast.success(
        `${successCount} user(s) imported as employees successfully!`,
      );
    if (failCount > 0)
      toast.error(
        `${failCount} user(s) failed to import (possibly duplicate ID).`,
      );
  };

  // Use Zustand store for global data
  const {
    globalAttendance,
    globalLeaves,
    globalAssets,
    globalPayroll,
    analyticsData,
    globalVacancies,
    recruitmentStats,
    globalClients,
    globalEmployers,
    globalPositions,
    globalPlacements,
    globalTickets,
    globalTicketTypes,
    globalAssessments,
    globalUsers,
    globalEmployees,
    createTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
    assignTicket,
    unassignTicket,
    createTicketType,
    deleteTicketType,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    fetchGlobalData,
  } = useHRStore();

  const [loading, setLoading] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // React Hook Form for Employees
  const formMethods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstNameEnglish: "",
      lastNameEnglish: "",
      firstNameKhmer: "",
      lastNameKhmer: "",
      gender: "Male",
      dateOfBirth: "",
      idNo: "",
      email: "",
      phoneNumber: "",
      address: "",
      department: "General",
      position: "Staff",
      joinDate: new Date().toISOString().split("T")[0],
      contractType: "Full-Time",
      status: "Active",
      basicSalary: 0,
      bankName: "",
      bankAccountNumber: "",
      emergencyContactName: "",
      emergencyContact: "",
      emergencyContactPhone: "",
      photo: "",
      title: "Mr",
      customFields: [],
    },
  });

  const {
    reset: resetForm,
    handleSubmit: hookSubmit,
    formState: { errors },
  } = formMethods;

  const [regTab, setRegTab] = useState<
    | "personal"
    | "employment"
    | "financial"
    | "emergency"
    | "experience"
    | "custom"
    | "biometric"
  >("personal");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moduleParam = params.get("module");
    if (moduleParam) {
      setActiveModule(moduleParam as any);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const seedDemoData = () => {
    toast.success("Demo mode active. Data is fetched from backend nodes.");
  };

  const handleViewDetails = async (emp: any) => {
    try {
      const response = await api.get(`/employees/${emp.id}`);
      const fullEmp = response.data;
      const processedEmp = {
        ...fullEmp,
        customFields: (() => {
          if (!fullEmp.customFields) return [];
          if (typeof fullEmp.customFields === "string") {
            try {
              return JSON.parse(fullEmp.customFields);
            } catch (e) {
              return [];
            }
          }
          return Array.isArray(fullEmp.customFields)
            ? fullEmp.customFields
            : [];
        })(),
      };

      setSelectedEmployee(processedEmp);
      setPortalTab("profile");
      setIsDetailModalOpen(true);
    } catch (err) {
      toast.error("Failed to load employee details");
    }
  };

  const handleEdit = async (emp: any) => {
    try {
      const response = await api.get(`/employees/${emp.id}`);
      const fullEmp = response.data;
      let parsedCustomFields: any[] = [];
      if (fullEmp.customFields) {
        if (typeof fullEmp.customFields === "string") {
          try {
            parsedCustomFields = JSON.parse(fullEmp.customFields);
          } catch (e) {}
        } else if (Array.isArray(fullEmp.customFields)) {
          parsedCustomFields = fullEmp.customFields;
        }
      }

      resetForm({
        firstNameEnglish: fullEmp.firstNameEnglish || "",
        lastNameEnglish: fullEmp.lastNameEnglish || "",
        firstNameKhmer: fullEmp.firstNameKhmer || "",
        lastNameKhmer: fullEmp.lastNameKhmer || "",
        gender: fullEmp.gender || "Male",
        dateOfBirth: fullEmp.dateOfBirth || "",
        idNo: fullEmp.idNo || "",
        email: fullEmp.email || "",
        phoneNumber: fullEmp.phoneNumber || "",
        address: fullEmp.address || "",
        department: fullEmp.department?.name || fullEmp.department || "General",
        position: fullEmp.position?.name || fullEmp.position || "Staff",
        joinDate: fullEmp.joinDate || new Date().toISOString().split("T")[0],
        contractStartDate: fullEmp.contractStartDate || undefined,
        contractEndDate: fullEmp.contractEndDate || undefined,
        probationEndDate: fullEmp.probationEndDate || undefined,
        contractType: fullEmp.contractType || "Full-Time",
        status: fullEmp.status || "Active",
        basicSalary: fullEmp.basicSalary || 0,
        bankName: fullEmp.bankName || "",
        bankAccountNumber: fullEmp.bankAccountNumber || "",
        emergencyContactName: fullEmp.emergencyContactName || "",
        emergencyContact: fullEmp.emergencyContact || "",
        emergencyContactPhone: fullEmp.emergencyContactPhone || "",
        photo: fullEmp.photo || "",
        title: fullEmp.title || "Mr",
        photoIdAttachment: fullEmp.photoIdAttachment || undefined,
        contractAttachment: fullEmp.contractAttachment || undefined,
        idPoorAttachment: fullEmp.idPoorAttachment || undefined,
        cvAttachment: fullEmp.cvAttachment || undefined,
        bloodGroup: fullEmp.bloodGroup || "",
        nationality: fullEmp.nationality || "",
        placeOfBirth: fullEmp.placeOfBirth || "",
        maritalStatus: fullEmp.maritalStatus || "",
        children: fullEmp.children || "",
        identityCardType: fullEmp.identityCardType || "",
        identityCardNumber: fullEmp.identityCardNumber || "",
        manager: fullEmp.manager || "",
        note: fullEmp.note || "",
        biometricStatus: fullEmp.biometricStatus || "",
        biometricId: fullEmp.biometricId || "",
        legacyPreviousPosition:
          parsedCustomFields.find((f) => f.key === "legacyPreviousPosition")
            ?.value || "",
        legacyEducation: (() => {
          const val = parsedCustomFields.find(
            (f) => f.key === "legacyEducation",
          )?.value;
          if (!val) return [];
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed)
              ? parsed
              : [{ institution: val, degree: "", year: "" }];
          } catch {
            return [{ institution: val, degree: "", year: "" }];
          }
        })(),
        legacyWorkExperience: (() => {
          const val = parsedCustomFields.find(
            (f) => f.key === "legacyWorkExperience",
          )?.value;
          if (!val) return [];
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed)
              ? parsed
              : [{ company: val, position: "", duration: "", description: "" }];
          } catch {
            return [
              { company: val, position: "", duration: "", description: "" },
            ];
          }
        })(),
        customFields: parsedCustomFields.filter(
          (f) =>
            ![
              "legacyPreviousPosition",
              "legacyEducation",
              "legacyWorkExperience",
            ].includes(f.key),
        ),
      });
      setEditingId(fullEmp.id);
      setIsEditMode(true);
      setRegTab("personal");
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load employee details for editing");
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete);
    setIsConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleUpdateSalary = async (employeeId: number, newSalary: number) => {
    try {
      const empRes = await api.get(`/employees/${employeeId}`);
      const currentEmp = empRes.data;

      const updatedData = {
        ...currentEmp,
        basicSalary: newSalary,
        department: currentEmp.department?.name || currentEmp.department,
        position: currentEmp.position?.name || currentEmp.position,
      };

      salaryMutation.mutate({ id: employeeId, data: updatedData });
    } catch (err: any) {
      toast.error("Failed to adjust salary scale.");
    }
  };

  const onFormSubmit = async (data: EmployeeFormData) => {
    const payloadCustomFields = [...(data.customFields || [])];
    if (data.legacyPreviousPosition)
      payloadCustomFields.push({
        key: "legacyPreviousPosition",
        value: data.legacyPreviousPosition,
      });
    if (data.legacyEducation && data.legacyEducation.length > 0)
      payloadCustomFields.push({
        key: "legacyEducation",
        value: JSON.stringify(data.legacyEducation),
      });
    if (data.legacyWorkExperience && data.legacyWorkExperience.length > 0)
      payloadCustomFields.push({
        key: "legacyWorkExperience",
        value: JSON.stringify(data.legacyWorkExperience),
      });

    const payload = {
      ...data,
      customFields: payloadCustomFields,
    };

    delete payload.legacyPreviousPosition;
    delete payload.legacyEducation;
    delete payload.legacyWorkExperience;

    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleManualAttendanceSubmit = async (data: any) => {
    try {
      await api.post("/hr/attendance/manual", data);
      toast.success("Manual attendance entry synchronized");
      setIsManualAttendanceOpen(false);
      fetchGlobalData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to commit manual log");
    }
  };

  const handleLeaveStatusUpdate = async (leaveId: number, status: string) => {
    try {
      setLoading(true);
      await api.put(`/hr/leaves/${leaveId}/status?status=${status}`);
      toast.success(`Leave request ${status.toLowerCase()} successfully`);
      fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to update leave status");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      setLoading(true);
      await api.post("/hr/payroll/process");
      toast.success("Enterprise payroll processed successfully");
      fetchGlobalData();
    } catch (err: any) {
      toast.error("Payroll processing failure");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnAsset = async (assetId: number) => {
    try {
      setLoading(true);
      await api.post(`/stock/hr/assets/${assetId}/return`);
      toast.success("Asset returned to inventory node");
      fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to process asset return");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAsset = async (assetId: number, employeeId: number) => {
    try {
      setLoading(true);
      await api.post(`/stock/hr/assets/${assetId}/assign/${employeeId}`);
      toast.success("Asset deployment successful");
      fetchGlobalData();
    } catch (err: any) {
      toast.error("Asset assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAsset = async (assetData: any) => {
    try {
      setLoading(true);
      const res = await api.post("/stock/hr/assets", assetData);
      if (res.data) {
        toast.success("New hardware node registered");
        await fetchGlobalData();
      }
    } catch (err: any) {
      toast.error("Asset registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAsset = async (id: number, data: any) => {
    try {
      setLoading(true);
      await api.put(`/stock/hr/assets/${id}`, data);
      toast.success("Hardware record updated");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to update equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (!window.confirm("Permanently purge this equipment node?")) return;
    try {
      setLoading(true);
      await api.delete(`/stock/hr/assets/${id}`);
      toast.success("Hardware node decommissioned");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to purge equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVacancy = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/vacancies", data);
      toast.success("New vacancy published");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to publish vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVacancy = async (id: number, data: any) => {
    try {
      setLoading(true);
      await api.put(`/vacancies/${id}`, data);
      toast.success("Vacancy updated");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to update vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVacancy = async (id: number) => {
    if (!window.confirm("Delete this vacancy posting?")) return;
    try {
      setLoading(true);
      await api.delete(`/vacancies/${id}`);
      toast.success("Vacancy removed");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to remove vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/clients", data);
      toast.success("Candidate enrolled");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to enroll candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidate = async (id: number, data: any) => {
    try {
      setLoading(true);
      await api.put(`/clients/${id}`, data);
      toast.success("Candidate profile updated");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to update candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    if (!window.confirm("Delete candidate profile?")) return;
    try {
      setLoading(true);
      await api.delete(`/clients/${id}`);
      toast.success("Candidate purged");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to purge candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlacement = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/placements", data);
      toast.success("Placement confirmed! Candidate hired.");
      await fetchGlobalData();
    } catch (err: any) {
      toast.error("Failed to confirm placement");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: Array.isArray(employees) ? employees.length : 0,
    active: Array.isArray(employees)
      ? employees.filter((e) => e?.status === "Active").length
      : 0,
    probation: Array.isArray(employees)
      ? employees.filter((e) => e?.status === "Probation").length
      : 0,
    fullTime: Array.isArray(employees)
      ? employees.filter((e) => e?.contractType === "Full-Time").length
      : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "on leave":
        return "warning";
      case "terminated":
        return "failure";
      default:
        return "info";
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Team Directory">
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <header className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 text-white rounded-md shadow-xl shadow-blue-500/20">
              <Activity size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black dark:text-white tracking-tight">
                HR Command Center
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-md bg-emerald-500 animate-pulse"></span>
                Node Active: Operational Compliance 98%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="light"
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="rounded-md border-2 px-4 h-12 font-black uppercase tracking-widest text-[10px]"
            >
              <TrendingUp size={16} className="mr-2 text-blue-600" /> Analytics
            </Button>
            <Button
              color="light"
              onClick={seedDemoData}
              className="rounded-md border-dashed border-2 px-4 py-1 h-12"
            >
              <Zap size={16} className="mr-2 text-yellow-500" /> Seed Data
            </Button>
            {activeModule === "directory" && (
              <Button
                color="blue"
                onClick={() => {
                  setIsEditMode(false);
                  setEditingId(null);
                  resetForm({
                    firstNameEnglish: "",
                    lastNameEnglish: "",
                    firstNameKhmer: "",
                    lastNameKhmer: "",
                    gender: "Male",
                    dateOfBirth: "",
                    idNo: "",
                    email: "",
                    phoneNumber: "",
                    address: "",
                    department: "General",
                    position: "Staff",
                    joinDate: new Date().toISOString().split("T")[0],
                    contractType: "Full-Time",
                    status: "Active",
                    basicSalary: 0,
                    bankName: "",
                    bankAccountNumber: "",
                    emergencyContactName: "",
                    emergencyContact: "",
                    emergencyContactPhone: "",
                    photo: "",
                    title: "Mr",
                    customFields: [],
                  });
                  setRegTab("personal");
                  setIsModalOpen(true);
                }}
                className="rounded-md h-12 font-black uppercase tracking-widest text-[10px] px-8 shadow-lg shadow-blue-500/20"
              >
                <UserPlus size={18} className="mr-2" /> Onboard Staff
              </Button>
            )}
          </div>
        </header>

        <nav className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-md border dark:border-gray-700/50 overflow-x-auto scrollbar-hide no-scrollbar animate-slide-up">
          {[
            { id: "directory", label: "Workforce", icon: <Users size={18} /> },
            {
              id: "attendance",
              label: "Attendance",
              icon: <Clock size={18} />,
            },
            { id: "leaves", label: "Leaves", icon: <Calendar size={18} /> },
            {
              id: "timeoff",
              label: "Time Off",
              icon: <CalendarCheck size={18} />,
            },
            {
              id: "analytics",
              label: "Intelligence",
              icon: <TrendingUp size={18} />,
            },
            { id: "payroll", label: "Payroll", icon: <DollarSign size={18} /> },
            { id: "assets", label: "Assets", icon: <Server size={18} /> },
            {
              id: "structure",
              label: "Structure",
              icon: <Building2 size={18} />,
            },
            { id: "training", label: "LMS", icon: <Award size={18} /> },
            {
              id: "compliance",
              label: "Compliance",
              icon: <ShieldCheck size={18} />,
            },
            { id: "portal", label: "My Portal", icon: <Activity size={18} /> },
            {
              id: "manager",
              label: "Manager Hub",
              icon: <CalendarCheck size={18} />,
            },
            {
              id: "scheduling",
              label: "Scheduling",
              icon: <Activity size={18} />,
            },
            {
              id: "retention",
              label: "Retention",
              icon: <TrendingUp size={18} />,
            },
            {
              id: "succession",
              label: "Succession",
              icon: <Award size={18} />,
            },
            { id: "wellness", label: "Wellness", icon: <Activity size={18} /> },
            { id: "automation", label: "AI/Flows", icon: <Zap size={18} /> },
            { id: "engagement", label: "Culture", icon: <Award size={18} /> },
            {
              id: "integrations",
              label: "Integrations",
              icon: <Settings size={18} />,
            },
            {
              id: "support",
              label: "Tickets System",
              icon: <ShieldCheck size={18} />,
            },
            { id: "reports", label: "Reports", icon: <FileText size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded text-xs font-black transition-all duration-300 transform hover:scale-105 active:scale-95 ${activeModule === item.id ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm ring-1 ring-blue-600 dark:ring-blue-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/30 ring-1 ring-gray-200 dark:ring-gray-700"}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <main className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeModule === "directory" && (
                <WorkforceDirectory
                  search={search}
                  setSearch={setSearch}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  deptFilter={deptFilter}
                  setDeptFilter={setDeptFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  contractFilter={contractFilter}
                  setContractFilter={setContractFilter}
                  stats={{ ...stats, total: totalElements }}
                  loading={queryLoading}
                  filteredEmployees={employees}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleViewDetails={handleViewDetails}
                  getStatusColor={getStatusColor}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  onRefresh={() =>
                    queryClient.invalidateQueries({ queryKey: ["employees"] })
                  }
                  onImportFromUsers={openImportModal}
                />
              )}
              {activeModule === "attendance" && (
                <AttendanceModule
                  globalAttendance={globalAttendance}
                  onManualLog={() => setIsManualAttendanceOpen(true)}
                  onOpenDeviceManager={() => setIsDeviceModalOpen(true)}
                />
              )}
              {activeModule === "leaves" && (
                <LeavesModule
                  globalLeaves={globalLeaves}
                  onUpdateStatus={handleLeaveStatusUpdate}
                />
              )}
              {activeModule === "timeoff" && <TimeOffOverview />}
              {activeModule === "analytics" && (
                <AnalyticsModule data={analyticsData} />
              )}
              {activeModule === "payroll" && (
                <PayrollModule
                  globalPayroll={globalPayroll}
                  employees={globalEmployees}
                  onProcess={handleProcessPayroll}
                  onUpdateSalary={handleUpdateSalary}
                />
              )}
              {activeModule === "assets" && (
                <AssetsModule
                  globalAssets={globalAssets}
                  employees={globalEmployees}
                  onAssign={handleAssignAsset}
                  onReturn={handleReturnAsset}
                  onRegister={handleRegisterAsset}
                  onUpdate={handleUpdateAsset}
                  onDelete={handleDeleteAsset}
                  onRefresh={fetchGlobalData}
                />
              )}
              {activeModule === "recruitment" && (
                <RecruitmentModule
                  vacancies={globalVacancies}
                  stats={recruitmentStats}
                  candidates={globalClients}
                  onAddVacancy={handleCreateVacancy}
                  onUpdateVacancy={handleUpdateVacancy}
                  onDeleteVacancy={handleDeleteVacancy}
                  onAddCandidate={handleCreateCandidate}
                  onUpdateCandidate={handleUpdateCandidate}
                  onDeleteCandidate={handleDeleteCandidate}
                  onPlaceCandidate={handleCreatePlacement}
                  employers={globalEmployers}
                  positions={globalPositions}
                  placements={globalPlacements}
                />
              )}
              {activeModule === "structure" && (
                <StructureModule
                  employees={globalEmployees}
                  positions={globalPositions}
                />
              )}
              {activeModule === "training" && (
                <TrainingModule employees={globalEmployees} />
              )}
              {activeModule === "compliance" && <ComplianceModule />}
              {activeModule === "integrations" && <IntegrationModule />}
              {activeModule === "automation" && <AutomationModule />}
              {activeModule === "engagement" && <EngagementModule />}
              {activeModule === "portal" && <PortalModule />}
              {activeModule === "manager" && <ManagerModule />}
              {activeModule === "scheduling" && <SchedulingModule />}
              {activeModule === "retention" && <RetentionModule />}
              {activeModule === "succession" && <SuccessionModule />}
              {activeModule === "wellness" && <WellnessModule />}
              {activeModule === "support" && (
                <SupportModule
                  tickets={globalTickets}
                  ticketTypes={globalTicketTypes}
                  assessments={globalAssessments}
                  users={globalUsers}
                  employees={globalEmployees}
                  onCreateTicket={createTicket}
                  onUpdateTicket={updateTicket}
                  onDeleteTicket={deleteTicket}
                  onUpdateTicketStatus={updateTicketStatus}
                  onAssignTicket={assignTicket}
                  onUnassignTicket={unassignTicket}
                  onCreateTicketType={createTicketType}
                  onDeleteTicketType={deleteTicketType}
                  onCreateAssessment={createAssessment}
                  onUpdateAssessment={updateAssessment}
                  onDeleteAssessment={deleteAssessment}
                />
              )}
              {activeModule === "reports" && <ReportsModule />}
              {![
                "directory",
                "attendance",
                "leaves",
                "analytics",
                "payroll",
                "assets",
                "stock",
                "recruitment",
                "structure",
                "training",
                "compliance",
                "integrations",
                "automation",
                "engagement",
                "portal",
                "manager",
                "scheduling",
                "retention",
                "succession",
                "wellness",
                "support",
                "reports",
              ].includes(activeModule) && (
                <div className="py-24 text-center animate-fade-in">
                  <Settings
                    size={64}
                    className="mx-auto text-gray-300 mb-6 animate-spin-slow"
                  />
                  <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">
                    Module Initializing
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-2">
                    Connecting to enterprise data node: {activeModule}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <EmployeeRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        regTab={regTab}
        setRegTab={setRegTab}
        formMethods={formMethods}
        onSubmit={onFormSubmit}
      />
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedEmployee={selectedEmployee}
        portalTab={portalTab}
        setPortalTab={setPortalTab}
      />
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />

      <ConfirmModal
        show={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Decommission Record"
        message="Are you sure you want to decommission this personnel record? This action is immutable."
      />
      <ManualAttendanceModal
        isOpen={isManualAttendanceOpen}
        onClose={() => setIsManualAttendanceOpen(false)}
        employees={employees}
        handleSubmit={handleManualAttendanceSubmit}
      />
      <BiometricDeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      {/* Import from Users Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsImportModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700/50 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white">
                    Import Users as Employees
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Select admin users to create employee records for them.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {importFetching ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Spinner size="xl" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Loading candidates...
                  </p>
                </div>
              ) : importCandidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-500">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-gray-500 dark:text-gray-400 text-sm">
                      All users are already employees
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Every admin user account already has a matching employee
                      record.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {importCandidates.length} unlinked user(s)
                    </span>
                    <button
                      onClick={() =>
                        setSelectedImportIds(
                          selectedImportIds.length === importCandidates.length
                            ? []
                            : importCandidates.map((c) => c.id),
                        )
                      }
                      className="text-xs font-bold text-violet-500 hover:text-violet-700 transition-colors"
                    >
                      {selectedImportIds.length === importCandidates.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                  {importCandidates.map((candidate) => (
                    <label
                      key={candidate.id}
                      className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                        selectedImportIds.includes(candidate.id)
                          ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-600"
                          : "border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImportIds.includes(candidate.id)}
                        onChange={() => toggleImportSelect(candidate.id)}
                        className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                      />
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/40 dark:to-purple-800/40 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                        {candidate.avatarUrl ? (
                          <img
                            src={candidate.avatarUrl}
                            alt={candidate.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase">
                            {candidate.firstName?.[0] || "U"}
                            {candidate.lastName?.[0] || ""}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-gray-900 dark:text-white text-sm leading-tight">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span className="text-blue-500 font-bold">
                            @{candidate.userName}
                          </span>
                          <span>·</span>
                          <span className="truncate">{candidate.email}</span>
                        </div>
                      </div>
                      {candidate.roles?.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end shrink-0">
                          {candidate.roles
                            .slice(0, 2)
                            .map((role: string, i: number) => (
                              <span
                                key={i}
                                className="text-[9px] font-black uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full tracking-wider"
                              >
                                {role}
                              </span>
                            ))}
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-900/40">
              <span className="text-xs text-gray-400">
                {selectedImportIds.length > 0 ? (
                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    {selectedImportIds.length} selected
                  </span>
                ) : (
                  "No users selected"
                )}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportUsers}
                  disabled={selectedImportIds.length === 0 || importLoading}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-black text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
                >
                  {importLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <UserPlus size={15} />
                  )}
                  Import{" "}
                  {selectedImportIds.length > 0
                    ? `(${selectedImportIds.length})`
                    : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployeesPage;
