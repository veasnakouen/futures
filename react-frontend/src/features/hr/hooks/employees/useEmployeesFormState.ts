import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeFormData } from "@/schemas/employeeSchema";
import api from "@/services/api";
import toast from "react-hot-toast";

interface FormStateProps {
  createMutation: any;
  updateMutation: any;
}

export function useEmployeesFormState({ createMutation, updateMutation }: FormStateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<string>("profile");
  const [isManualAttendanceOpen, setIsManualAttendanceOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [loading] = useState(false);

  const [regTab, setRegTab] = useState<
    | "personal"
    | "employment"
    | "financial"
    | "emergency"
    | "experience"
    | "custom"
    | "biometric"
  >("personal");

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

  const { reset: resetForm, handleSubmit: hookSubmit } = formMethods;

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
              const parsed = JSON.parse(fullEmp.customFields);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          }
          return Array.isArray(fullEmp.customFields) ? fullEmp.customFields : [];
        })(),
      };

      setSelectedEmployee(processedEmp);
      setPortalTab("profile");
      setIsDetailModalOpen(true);
    } catch {
      toast.error("Failed to load employee details");
    }
  };

  const handleEdit = async (emp: any) => {
    let fullEmp = emp;
    try {
      const response = await api.get(`/employees/${emp.id}`);
      if (response.data) {
        fullEmp = response.data;
      }
    } catch {
      console.warn("Using fallback employee data for edit form");
    }

    setEditingId(fullEmp.id);
    setIsEditMode(true);
    resetForm({
      firstNameEnglish: fullEmp.firstNameEnglish || "",
      lastNameEnglish: fullEmp.lastNameEnglish || "",
      firstNameKhmer: fullEmp.firstNameKhmer || "",
      lastNameKhmer: fullEmp.lastNameKhmer || "",
      gender: fullEmp.gender || "Male",
      dateOfBirth: fullEmp.dateOfBirth ? fullEmp.dateOfBirth.substring(0, 10) : "",
      idNo: fullEmp.idNo || "",
      email: fullEmp.email || "",
      phoneNumber: fullEmp.phoneNumber || "",
      address: fullEmp.address || "",
      department: fullEmp.departmentName || fullEmp.department?.name || "General",
      position: fullEmp.positionName || fullEmp.position?.name || "Staff",
      joinDate: fullEmp.joinDate
        ? fullEmp.joinDate.substring(0, 10)
        : new Date().toISOString().split("T")[0],
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
      customFields: Array.isArray(fullEmp.customFields) ? fullEmp.customFields : [],
    });
    setRegTab("personal");
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
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
  };

  const onFormSubmit = (formData: EmployeeFormData) => {
    if (isEditMode && editingId) {
      updateMutation.mutate(
        { id: editingId, data: formData },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isAnalyticsModalOpen,
    setIsAnalyticsModalOpen,
    isEditMode,
    editingId,
    selectedEmployee,
    setSelectedEmployee,
    isDetailModalOpen,
    setIsDetailModalOpen,
    portalTab,
    setPortalTab,
    isManualAttendanceOpen,
    setIsManualAttendanceOpen,
    isDeviceModalOpen,
    setIsDeviceModalOpen,
    loading,
    formMethods,
    regTab,
    setRegTab,
    handleViewDetails,
    handleEdit,
    handleOpenAddModal,
    onFormSubmit,
    hookSubmit,
  };
}
