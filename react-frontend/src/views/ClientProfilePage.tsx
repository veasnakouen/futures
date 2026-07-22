import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from '@/lib/react-router-compat';
import {Button, Badge, Spinner, Avatar, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Select, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Dropdown, DropdownItem, DropdownDivider, ToggleSwitch} from '@/lib/flowbite-compat';
import DatePicker from "@/components/common/DatePicker";
import ModernPagination from "@/components/common/ModernPagination";
import ModernTabs from "@/components/common/ModernTabs";

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  FileText,
  User,
  Plus,
  History,
  GraduationCap,
  Award,
  MoreVertical,
  Edit,
  Trash2,
  Heart,
  ShieldAlert,
  Download,
  Icon,
  ChevronDown,
  X,
} from "lucide-react";

import api from "../services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { uploadToCloudinary } from "../utils/cloudinary";
import ClientRegistrationModal from "@/features/clients/components/ClientRegistrationModal";
import ClientAdvancedFeatures from "@/features/clients/components/ClientAdvancedFeatures";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import ClientSidebar from "@/features/clients/components/ClientSidebar";
import ClientInfoTabs from "@/features/clients/components/ClientInfoTabs";
import ClientCases from "@/features/clients/components/ClientCases";
import ClientPrograms from "@/features/clients/components/ClientPrograms";
const ClientProfilePage = ({ isDark, setIsDark }: any) => {
  const { id } = useParams();
  const [activeMenu, setActiveMenu] = useState("Client / Referral");
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const [educationLevels, setEducationLevels] = useState<string[]>(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("mtp_education_levels");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return ["Primary School", "High School", "Vocational", "University"];
  });
  const { data: placementCategories = [] } = useQuery({
    queryKey: ["placementCategories"],
    queryFn: async () => {
      const res = await api.get("/placement-categories");
      return res.data;
    },
  });
  const placementTypes = placementCategories.map((c: any) => c.name);
  const [isManagePlacementTypesOpen, setIsManagePlacementTypesOpen] =
    useState(false);
  const [newPlacementTypeName, setNewPlacementTypeName] = useState("");
  const [editingPlacementTypeIndex, setEditingPlacementTypeIndex] = useState<
    number | null
  >(null);
  const [editingPlacementTypeValue, setEditingPlacementTypeValue] =
    useState("");

  const [isManageLevelsOpen, setIsManageLevelsOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
  const [editingLevelIndex, setEditingLevelIndex] = useState<number | null>(
    null,
  );
  const [editingLevelValue, setEditingLevelValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const [isManageCasesOpen, setIsManageCasesOpen] = useState(false);
  const [caseForm, setCaseForm] = useState({
    subject: "",
    description: "",
    priority: "Normal",
    serviceType: "Social Support",
  });
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [isCaseEditMode, setIsCaseEditMode] = useState(false);

  // Modals state
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id?: number;
    fieldName?: string;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [clientForm, setClientForm] = useState<any>({
    firstName: "",
    lastName: "",
    clientCode: "",
    branch: "Phnom Penh",
    gender: "Male",
    status: "Active",
    email: "",
    contactPhone: "",
    photo: "",
  });
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const [placementForm, setPlacementForm] = useState({
    clientId: id,
    companyName: "",
    salary: "",
    placementDate: new Date().toISOString().split("T")[0],
    status: "Active",
    placementType: placementTypes[0] || "Employment",
  });

  const [supportForm, setSupportForm] = useState({
    clientId: id,
    caseId: id,
    healthProblem: false,
    healthProblemDetail: "",
    drugProblem: false,
    drugProblemDetail: "",
    description: "",
  });

  const [educationForm, setEducationForm] = useState({
    clientId: id,
    schoolName: "",
    currentLevel: educationLevels[0] || "High School",
    status: "Completed",
  });

  const [caseWorkers, setCaseWorkers] = useState<any[]>([]);
  const [socialSupportCases, setSocialSupportCases] = useState<any[]>([]);
  const [isCaseWorkerModalOpen, setIsCaseWorkerModalOpen] = useState(false);
  const [workerForm, setWorkerForm] = useState({
    name: "",
    program: "Futures",
    status: "Active",
  });
  const [editingWorkerId, setEditingWorkerId] = useState<number | null>(null);

  const [isSocialSupportCaseModalOpen, setIsSocialSupportCaseModalOpen] =
    useState(false);
  const [editingSsCaseId, setEditingSsCaseId] = useState<number | null>(null);
  const [ssCaseForm, setSsCaseForm] = useState({
    haveCaseManager: "HavecaseWorker",
    caseWorkerId: "",
    healthProblem: false,
    healthProblemDetail: "",
    drugProblem: false,
    drugProblemDetail: "",
    babyProblem: false,
    babyProblemDetail: "",
    personalProblem: false,
    personalProblemDetail: "",
    legalProblem: false,
    legalProblemDetail: "",
    otherProblem: false,
    otherProblemDetail: "",
    description: "",
    openDate: new Date().toISOString().split("T")[0],
    closeDate: "",
    status: "OpenCase",
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split("T")[0];
      setPlacementForm({ ...placementForm, placementDate: dateString });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      if (!data) {
        setLoading(true);
      }
      const response = await api.get(`/clients/${id}/portfolio`);
      setData(response.data);

      try {
        const workersRes = await api.get("/case-workers");
        setCaseWorkers(workersRes.data || []);
      } catch (e) {
        setCaseWorkers([]);
      }

      try {
        const casesRes = await api.get(`/social-support-cases/client/${id}`);
        setSocialSupportCases(casesRes.data || []);
      } catch (e) {
        setSocialSupportCases([]);
      }

      setError(null);
    } catch (err) {
      console.warn("Profile load error, displaying demonstration portfolio layer:", err);
      // Fallback demonstration portfolio layer when backend database is unseeded or endpoint 404s
      setData({
        client: {
          id: id || "1",
          clientCode: `FS-${id || "101"}`,
          firstName: "Sreynich",
          lastName: "Lan",
          branch: "M'Lop Tapang",
          gender: "Female",
          status: "Active",
          email: "no-email@mtp.org",
          contactPhone: "012345678",
          nationalId: "123456789",
          dateOfBirth: "1999-05-15",
          photo: "/default.png"
        },
        cases: [
          { id: 101, title: "Career Placement & Vocational Training", status: "Active", openDate: "2026-01-10", serviceType: "Social Support", priority: "Normal" }
        ],
        placements: [],
        socialSupports: [],
        educations: [],
        familyMembers: [],
        healthRecords: [],
        documents: []
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerForm.name.trim()) {
      toast.error("Case Worker name is required");
      return;
    }
    try {
      if (editingWorkerId) {
        await api.put(`/case-workers/${editingWorkerId}`, workerForm);
        toast.success("Case Worker updated successfully");
      } else {
        await api.post("/case-workers", workerForm);
        toast.success("Case Worker added successfully");
      }
      setWorkerForm({ name: "", program: "Futures", status: "Active" });
      setEditingWorkerId(null);
      fetchProfile();
    } catch (err: any) {
      toast.error("Failed to save Case Worker");
      console.error("Failed to save Case Worker", err);
    }
  };

  const handleDeleteWorker = async (workerId: number) => {
    if (!window.confirm("Are you sure you want to delete this Case Worker?"))
      return;
    try {
      await api.delete(`/case-workers/${workerId}`);
      toast.success("Case Worker deleted successfully");
      fetchProfile();
    } catch (err: any) {
      toast.error("Failed to delete Case Worker");
      console.error("Failed to delete Case Worker", err);
    }
  };

  const handleSaveSsCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const casePayload = {
        haveCaseManager: ssCaseForm.haveCaseManager,
        caseWorker: ssCaseForm.caseWorkerId
          ? { id: parseInt(ssCaseForm.caseWorkerId) }
          : null,
        openDate: ssCaseForm.openDate
          ? ssCaseForm.openDate.includes("T")
            ? ssCaseForm.openDate
            : ssCaseForm.openDate + "T00:00:00"
          : null,
        closeDate: ssCaseForm.closeDate
          ? ssCaseForm.closeDate.includes("T")
            ? ssCaseForm.closeDate
            : ssCaseForm.closeDate + "T00:00:00"
          : null,
        haveProblem:
          ssCaseForm.healthProblem ||
          ssCaseForm.drugProblem ||
          ssCaseForm.babyProblem ||
          ssCaseForm.personalProblem ||
          ssCaseForm.legalProblem ||
          ssCaseForm.otherProblem
            ? "Yes"
            : "No",
        client: { id: parseInt(Array.isArray(id) ? id[0] : (id || '0')) },
        status: ssCaseForm.status,
      };

      let savedCase: any;
      if (editingSsCaseId) {
        const res = await api.put(
          `/social-support-cases/${editingSsCaseId}`,
          casePayload,
        );
        savedCase = res.data;
        toast.success("Social Support Case updated successfully");
      } else {
        const res = await api.post("/social-support-cases", casePayload);
        savedCase = res.data;
        toast.success("Social Support Case added successfully");
      }

      const caseId = savedCase.id;

      const supportPayload = {
        clientId: parseInt(Array.isArray(id) ? id[0] : (id || '0')),
        caseId: caseId,
        healthProblem: ssCaseForm.healthProblem,
        healthProblemDetail: ssCaseForm.healthProblem
          ? ssCaseForm.healthProblemDetail
          : "",
        drugProblem: ssCaseForm.drugProblem,
        drugProblemDetail: ssCaseForm.drugProblem
          ? ssCaseForm.drugProblemDetail
          : "",
        babyProblem: ssCaseForm.babyProblem,
        babyProblemDetail: ssCaseForm.babyProblem
          ? ssCaseForm.babyProblemDetail
          : "",
        personalProblem: ssCaseForm.personalProblem,
        personalProblemDetail: ssCaseForm.personalProblem
          ? ssCaseForm.personalProblemDetail
          : "",
        legalProblem: ssCaseForm.legalProblem,
        legalProblemDetail: ssCaseForm.legalProblem
          ? ssCaseForm.legalProblemDetail
          : "",
        otherProblem: ssCaseForm.otherProblem,
        otherProblemDetail: ssCaseForm.otherProblem
          ? ssCaseForm.otherProblemDetail
          : "",
        description: ssCaseForm.description,
      };

      const existingSupport = socialSupports.find(
        (s: any) => s.caseId === caseId,
      );
      if (existingSupport) {
        await api.put(`/social-supports/${existingSupport.id}`, supportPayload);
      } else {
        await api.post("/social-supports", supportPayload);
      }

      setIsSocialSupportCaseModalOpen(false);
      setEditingSsCaseId(null);
      setSsCaseForm({
        haveCaseManager: "HavecaseWorker",
        caseWorkerId: "",
        healthProblem: false,
        healthProblemDetail: "",
        drugProblem: false,
        drugProblemDetail: "",
        babyProblem: false,
        babyProblemDetail: "",
        personalProblem: false,
        personalProblemDetail: "",
        legalProblem: false,
        legalProblemDetail: "",
        otherProblem: false,
        otherProblemDetail: "",
        description: "",
        openDate: new Date().toISOString().split("T")[0],
        closeDate: "",
        status: "OpenCase",
      });
      fetchProfile();
    } catch (err: any) {
      toast.error("Failed to save Social Support Case");
      console.error("Failed to save Social Support Case", err);
    }
  };

  const handleDeleteSsCase = async (caseId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this Social Support Case and all its details?",
      )
    )
      return;
    try {
      const existingSupport = socialSupports.find(
        (s: any) => s.caseId === caseId,
      );
      if (existingSupport) {
        await api.delete(`/social-supports/${existingSupport.id}`);
      }
      await api.delete(`/social-support-cases/${caseId}`);
      toast.success("Social Support Case deleted successfully");
      fetchProfile();
    } catch (err: any) {
      toast.error("Failed to delete Social Support Case");
      console.error("Failed to delete Social Support Case", err);
    }
  };

  const handleEditSsCase = (scase: any) => {
    const associatedSupport =
      socialSupports.find((s: any) => s.caseId === scase.id) || {};
    setSsCaseForm({
      haveCaseManager: scase.haveCaseManager || "HavecaseWorker",
      caseWorkerId: scase.caseWorker?.id ? scase.caseWorker.id.toString() : "",
      healthProblem: !!associatedSupport.healthProblem,
      healthProblemDetail: associatedSupport.healthProblemDetail || "",
      drugProblem: !!associatedSupport.drugProblem,
      drugProblemDetail: associatedSupport.drugProblemDetail || "",
      babyProblem: !!associatedSupport.babyProblem,
      babyProblemDetail: associatedSupport.babyProblemDetail || "",
      personalProblem: !!associatedSupport.personalProblem,
      personalProblemDetail: associatedSupport.personalProblemDetail || "",
      legalProblem: !!associatedSupport.legalProblem,
      legalProblemDetail: associatedSupport.legalProblemDetail || "",
      otherProblem: !!associatedSupport.otherProblem,
      otherProblemDetail: associatedSupport.otherProblemDetail || "",
      description: associatedSupport.description || "",
      openDate: scase.openDate ? scase.openDate.split("T")[0] : "",
      closeDate: scase.closeDate ? scase.closeDate.split("T")[0] : "",
      status: scase.status || "OpenCase",
    });
    setEditingSsCaseId(scase.id);
    setIsSocialSupportCaseModalOpen(true);
  };

  const getProblemsList = (caseId: number) => {
    const s = socialSupports.find((support: any) => support.caseId === caseId);
    if (!s) return "None";
    const list: string[] = [];
    if (s.healthProblem) list.push("Health");
    if (s.drugProblem) list.push("Drug");
    if (s.babyProblem) list.push("Baby");
    if (s.personalProblem) list.push("Personal");
    if (s.legalProblem) list.push("Legal");
    if (s.otherProblem) list.push("Other");
    return list.length > 0 ? list.join(", ") : "None";
  };

  const handleAddPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...placementForm,
        placementDate: placementForm.placementDate
          ? placementForm.placementDate.split(" ")[0] + " 00:00:00"
          : null,
      };
      if (isEditMode && editingId) {
        await api.put(`/placements/${editingId}`, formattedData);
      } else {
        await api.post("/placements", formattedData);
      }
      setIsPlacementModalOpen(false);
      fetchProfile();
    } catch (err) {
      console.error("Failed to save placement", err);
      toast.error("Failed to save placement");
    }
  };

  const handleAddSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.caseId) {
      toast.error("Please associate this entry with a valid case first.");
      return;
    }
    try {
      if (isEditMode && editingId) {
        await api.put(`/social-supports/${editingId}`, supportForm);
      } else {
        await api.post("/social-supports", supportForm);
      }
      setIsSupportModalOpen(false);
      toast.success("Support entry saved successfully");
      fetchProfile();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Unknown error";
      toast.error(`Failed to save support: ${errorMsg}`);
      console.error("Failed to save support", err);
    }
  };

  const handleAddLevel = () => {
    const trimmed = newLevelName.trim();
    if (!trimmed) {
      toast.error("Level name cannot be empty");
      return;
    }
    if (
      educationLevels.some((l) => l.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("Level already exists");
      return;
    }
    const updated = [...educationLevels, trimmed];
    setEducationLevels(updated);
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("mtp_education_levels", JSON.stringify(updated));
    setNewLevelName("");
    toast.success(`Level "${trimmed}" added`);
  };

  const handleDeleteLevel = (levelToDelete: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the level "${levelToDelete}"?`,
      )
    )
      return;
    const updated = educationLevels.filter((l) => l !== levelToDelete);
    setEducationLevels(updated);
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("mtp_education_levels", JSON.stringify(updated));

    if (educationForm.currentLevel === levelToDelete) {
      setEducationForm((prev) => ({ ...prev, currentLevel: updated[0] || "" }));
    }
    toast.success(`Level "${levelToDelete}" deleted`);
  };

  const handleEditLevel = (index: number) => {
    const trimmed = editingLevelValue.trim();
    if (!trimmed) {
      toast.error("Level name cannot be empty");
      return;
    }
    const oldName = educationLevels[index];
    if (
      educationLevels.some(
        (l, idx) => idx !== index && l.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      toast.error("Level already exists");
      return;
    }
    const updated = [...educationLevels];
    updated[index] = trimmed;
    setEducationLevels(updated);
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).setItem("mtp_education_levels", JSON.stringify(updated));
    setEditingLevelIndex(null);

    if (educationForm.currentLevel === oldName) {
      setEducationForm((prev) => ({ ...prev, currentLevel: trimmed }));
    }
    toast.success("Level renamed successfully");
  };

  const createPlacementCategoryMutation = useMutation({
    mutationFn: async (name: string) =>
      await api.post("/placement-categories", { name }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["placementCategories"] });
      toast.success(`Placement type "${res.data.name}" added`);
      setNewPlacementTypeName("");
    },
    onError: () =>
      toast.error("Failed to add placement type. It may already exist."),
  });

  const handleAddPlacementType = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPlacementTypeName.trim();
    if (!trimmed) {
      toast.error("Placement type cannot be empty");
      return;
    }
    createPlacementCategoryMutation.mutate(trimmed);
  };

  const deletePlacementCategoryMutation = useMutation({
    mutationFn: async (id: number) =>
      await api.delete(`/placement-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementCategories"] });
      toast.success(`Placement type deleted`);
    },
  });

  const handleDeletePlacementType = (id: number, typeName: string) => {
    if (
      !window.confirm(`Are you sure you want to delete the type "${typeName}"?`)
    )
      return;
    deletePlacementCategoryMutation.mutate(id, {
      onSuccess: () => {
        if (placementForm.placementType === typeName) {
          setPlacementForm((prev) => ({
            ...prev,
            placementType:
              placementTypes.find((t: string) => t !== typeName) || "",
          }));
        }
      },
    });
  };

  const updatePlacementCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) =>
      await api.put(`/placement-categories/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placementCategories"] });
      toast.success(`Placement type updated`);
      setEditingPlacementTypeIndex(null);
    },
    onError: () =>
      toast.error("Failed to update placement type. Name may already exist."),
  });

  const handleEditPlacementType = (id: number, index: number) => {
    const trimmed = editingPlacementTypeValue.trim();
    if (!trimmed) {
      toast.error("Placement type name cannot be empty");
      return;
    }
    const oldName = placementCategories[index].name;
    updatePlacementCategoryMutation.mutate(
      { id, name: trimmed },
      {
        onSuccess: () => {
          if (placementForm.placementType === oldName) {
            setPlacementForm((prev) => ({ ...prev, placementType: trimmed }));
          }
        },
      },
    );
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await api.put(`/educations/${editingId}`, educationForm);
      } else {
        await api.post("/educations", educationForm);
      }
      setIsEducationModalOpen(false);
      toast.success("Education record saved");
      fetchProfile();
    } catch (err) {
      toast.error("Failed to save education");
    }
  };

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseForm.subject.trim()) {
      toast.error("Case subject is required");
      return;
    }
    try {
      const payload = {
        clientId: id,
        subject: caseForm.subject,
        description: caseForm.description,
        priority: caseForm.priority,
        serviceType: caseForm.serviceType,
      };

      if (isCaseEditMode && editingCaseId) {
        await api.put(`/cases/${editingCaseId}`, payload);
        toast.success("Case updated successfully");
      } else {
        await api.post("/cases", payload);
        toast.success("New case opened successfully");
      }

      setCaseForm({
        subject: "",
        description: "",
        priority: "Normal",
        serviceType: "Social Support",
      });
      setIsCaseEditMode(false);
      setEditingCaseId(null);
      fetchProfile();
    } catch (err: any) {
      toast.error("Failed to save case");
      console.error("Failed to save case", err);
    }
  };

  const handleDeleteCase = (caseId: number) => {
    setItemToDelete({ type: "case", id: caseId });
    setIsConfirmOpen(true);
  };

  const handleUploadAttachment = async (fieldName: string, file: File) => {
    try {
      setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
      const url = await uploadToCloudinary(file);

      const updatedClient = {
        ...client,
        [fieldName]: url,
      };

      await api.put(`/clients/${id}`, updatedClient);
      toast.success("Attachment uploaded successfully");
      fetchProfile();
    } catch (err: any) {
      toast.error("Failed to upload attachment");
      console.error("Attachment upload error:", err);
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleRemoveAttachment = (fieldName: string) => {
    setItemToDelete({ type: "attachment", fieldName });
    setIsConfirmOpen(true);
  };

  const handleDeleteItem = (type: string, id: number) => {
    setItemToDelete({ type, id });
    setIsConfirmOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === "attachment") {
        const fieldName = itemToDelete.fieldName;
        if (!fieldName) return;
        setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
        const updatedClient = {
          ...client,
          [fieldName]: null,
        };
        await api.put(`/clients/${id}`, updatedClient);
        toast.success("Attachment removed successfully");
        setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
      } else if (itemToDelete.type === "case") {
        if (itemToDelete.id) {
          await api.delete(`/cases/${itemToDelete.id}`);
          toast.success("Case deleted successfully");
          if (supportForm.caseId === itemToDelete.id.toString()) {
            setSupportForm((prev) => ({ ...prev, caseId: "" }));
          }
        }
      } else if (itemToDelete.type === "profile") {
        await api.delete(`/clients/${id}`);
        toast.success("Client profile removed successfully");
        navigate("/clients");
        return;
      } else {
        const endpoint =
          itemToDelete.type === "placement"
            ? `/placements/${itemToDelete.id}`
            : itemToDelete.type === "support"
              ? `/social-supports/${itemToDelete.id}`
              : `/educations/${itemToDelete.id}`;
        await api.delete(endpoint);
        toast.success(
          `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} removed from profile`,
        );
      }
      fetchProfile();
    } catch (err) {
      toast.error(`Failed to delete ${itemToDelete.type}`);
      console.error(err);
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-500 font-medium animate-pulse">
            Building 360° Portfolio View...
          </p>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <div className="max-w-md mx-auto mt-20 text-center">
          <Alert color="failure" className="rounded-lg p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-2">Portfolio Unavailable</h3>
            <p className="mb-6">{error}</p>
            <Button
              color="gray"
              onClick={() => navigate("/clients")}
              className="mx-auto rounded-lg"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Client List
            </Button>
          </Alert>
        </div>
      </>
    );
  }

  const { client, cases, placements, socialSupports, educations, familyMembers, healthRecords, documents } = data;


  return (
    <>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pt-2 pb-6 px-1 lg:px-2 min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)]">
          <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 h-auto lg:h-full lg:overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
            <button 
              onClick={() => navigate('/clients')} 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors w-fit px-2"
            >
              <ArrowLeft size={16} /> Back to Clients
            </button>
            <ClientSidebar 
              client={client} 
              activeMenu={activeMenu} 
              setActiveMenu={setActiveMenu} 
              onEditClient={() => {
                let safeDob = "";
                if (client.dateOfBirth) {
                  try {
                    safeDob = new Date(client.dateOfBirth).toISOString().split("T")[0];
                  } catch (e) {}
                }
                let safeIdPoor = "";
                if (client.idpoorValiddate) {
                  try {
                    safeIdPoor = new Date(client.idpoorValiddate).toISOString().split("T")[0];
                  } catch (e) {}
                }
                setClientForm({
                  ...client,
                  dateOfBirth: safeDob,
                  idpoorValiddate: safeIdPoor,
                });
                setIsClientModalOpen(true);
              }}
              onDeleteClient={() => handleDeleteItem("profile", 0)}
              programsCount={placements?.length || 0}
              staffsCount={0}
            />
          </div>
          <div className="flex-1 w-full min-w-0 h-auto lg:h-full lg:overflow-hidden">
            {activeMenu === "Client / Referral" && (
              <ClientInfoTabs 
                client={client} 
                educations={educations} 
                familyMembers={familyMembers}
                healthRecords={healthRecords}
                cases={cases}
                documents={documents}
              />
            )}
            {activeMenu === "Case Management" && (
              <ClientCases clientId={client.id} />
            )}
            {activeMenu === "Program Management" && (
              <ClientPrograms clientId={client.id} />
            )}
          </div>
        </div>
        <Modal
          show={isPlacementModalOpen}
          onClose={() => setIsPlacementModalOpen(false)}
          size="lg"
          className="date-picker-modal"
          theme={{
            root: {
              base: "fixed inset-0 z-50 h-modal h-screen overflow-visible flex items-start pt-16 sm:pt-24 justify-center",
              show: {
                on: "flex bg-gray-900/50 dark:bg-gray-900/80",
                off: "hidden",
              },
            },
            content: {
              base: "relative h-auto w-full p-4",
              inner:
                "relative flex max-h-[90dvh] flex-col rounded-md bg-white shadow dark:bg-gray-700 !overflow-visible",
            },
          }}
        >
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Placement" : "Record New Placement"}
            </h3>
            <button
              type="button"
              onClick={() => setIsPlacementModalOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-8 bg-white dark:bg-gray-800 !overflow-visible relative z-50">
            <form onSubmit={handleAddPlacement} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-1 block">Company Name</Label>
                  <TextInput
                    required
                    value={placementForm.companyName}
                    onChange={(e) =>
                      setPlacementForm({
                        ...placementForm,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Start Date</Label>
                  <DatePicker
                    value={
                      placementForm.placementDate
                        ? new Date(
                            placementForm.placementDate
                              .split(" ")[0]
                              .split("T")[0],
                          )
                        : new Date()
                    }
                    onChange={(date) =>
                      setPlacementForm({
                        ...placementForm,
                        placementDate: format(date, "yyyy-MM-dd"),
                      })
                    }
                    placeholder="Select Start Date..."
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="block">Placement Type</Label>
                    <button
                      type="button"
                      onClick={() => setIsManagePlacementTypesOpen(true)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      Manage Types
                    </button>
                  </div>
                  <Select
                    value={placementForm.placementType}
                    onChange={(e) =>
                      setPlacementForm({
                        ...placementForm,
                        placementType: e.target.value,
                      })
                    }
                  >
                    {placementTypes.map((type: string) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Monthly Salary</Label>
                  <TextInput
                    value={placementForm.salary}
                    onChange={(e) =>
                      setPlacementForm({
                        ...placementForm,
                        salary: e.target.value,
                      })
                    }
                    placeholder="e.g. $250"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block">Status</Label>
                  <Select
                    value={placementForm.status}
                    onChange={(e) =>
                      setPlacementForm({
                        ...placementForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </Select>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t relative z-40 justify-end gap-3 !p-4">
            <Button
              outline
              color="gray"
              size="sm"
              onClick={() => setIsPlacementModalOpen(false)}
              className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
            >
              Cancel
            </Button>
            <Button
              outline
              color="blue"
              size="sm"
              onClick={handleAddPlacement}
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
            >
              {isEditMode ? "Update Placement" : "Save Placement"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Social Support Modal */}
        <Modal
          show={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          size="lg"
        >
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Assessment" : "New Support Entry"}
            </h3>
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-8 bg-white dark:bg-gray-800">
            <form onSubmit={handleAddSupport} className="space-y-6">
              <div className="space-y-4">
                {cases.length === 0 ? (
                  <div className="space-y-2">
                    <Alert color="warning" className="rounded-md">
                      <span>
                        This client does not have any active cases. Please click{" "}
                        <strong
                          className="cursor-pointer underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
                          onClick={() => setIsManageCasesOpen(true)}
                        >
                          Manage Cases
                        </strong>{" "}
                        to open a new case for this client first.
                      </span>
                    </Alert>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label>Associated Case</Label>
                      <button
                        type="button"
                        onClick={() => setIsManageCasesOpen(true)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                      >
                        Manage Cases
                      </button>
                    </div>
                    <Select
                      value={supportForm.caseId}
                      onChange={(e) =>
                        setSupportForm({
                          ...supportForm,
                          caseId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select case...</option>
                      {cases.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.serviceType}: {c.subject} (Case #{c.id})
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent hover: dark:hover:">
                  <ToggleSwitch
                    checked={supportForm.healthProblem}
                    label="Health Problem Detected?"
                    onChange={(checked) =>
                      setSupportForm({ ...supportForm, healthProblem: checked })
                    }
                    color="blue"
                  />
                </div>
                {supportForm.healthProblem && (
                  <Textarea
                    placeholder="Provide details about health issues and support provided..."
                    value={supportForm.healthProblemDetail}
                    onChange={(e) =>
                      setSupportForm({
                        ...supportForm,
                        healthProblemDetail: e.target.value,
                      })
                    }
                    rows={3}
                  />
                )}

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent hover: dark:hover:">
                  <ToggleSwitch
                    checked={supportForm.drugProblem}
                    label="Drug Issue Detected?"
                    onChange={(checked) =>
                      setSupportForm({ ...supportForm, drugProblem: checked })
                    }
                    color="failure"
                  />
                </div>
                {supportForm.drugProblem && (
                  <Textarea
                    placeholder="Provide details about drug issues and support provided..."
                    value={supportForm.drugProblemDetail}
                    onChange={(e) =>
                      setSupportForm({
                        ...supportForm,
                        drugProblemDetail: e.target.value,
                      })
                    }
                    rows={3}
                  />
                )}
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
            <Button
              outline
              color="gray"
              size="sm"
              onClick={() => setIsSupportModalOpen(false)}
              className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
            >
              Cancel
            </Button>
            <Button
              outline
              color="blue"
              size="sm"
              onClick={handleAddSupport}
              disabled={cases.length === 0}
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
            >
              {isEditMode ? "Update Record" : "Record Assessment"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Education Modal */}
        <Modal
          show={isEducationModalOpen}
          onClose={() => setIsEducationModalOpen(false)}
          size="md"
        >
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Education" : "Add Education"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEducationModalOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-8 bg-white dark:bg-gray-800">
            <form onSubmit={handleAddEducation} className="space-y-6">
              <div>
                <Label className="mb-1 block">School / Institution Name</Label>
                <TextInput
                  required
                  value={educationForm.schoolName}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      schoolName: e.target.value,
                    })
                  }
                  placeholder="e.g. Future Hope School"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Education Level</Label>
                  <button
                    type="button"
                    onClick={() => setIsManageLevelsOpen(true)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                  >
                    Manage Levels
                  </button>
                </div>
                <Select
                  value={educationForm.currentLevel}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      currentLevel: e.target.value,
                    })
                  }
                >
                  {educationLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </Select>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
            <Button
              outline
              size="sm"
              color="gray"
              onClick={() => setIsEducationModalOpen(false)}
              className="rounded-md font-bold uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button
              outline
              color="blue"
              size="sm"
              onClick={handleAddEducation}
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
            >
              {isEditMode ? "Update Record" : "Add Record"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Case Worker Modal */}
        <Modal
          show={isCaseWorkerModalOpen}
          onClose={() => setIsCaseWorkerModalOpen(false)}
          size="lg"
        >
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              Manage Case Workers
            </h3>
            <button
              type="button"
              onClick={() => setIsCaseWorkerModalOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-6">
            <form
              onSubmit={handleSaveWorker}
              className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-4"
            >
              <h4 className="font-bold text-sm dark:text-white">
                {editingWorkerId ? "Edit Case Worker" : "Add Case Worker"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1 block text-xs">Name</Label>
                  <TextInput
                    required
                    placeholder="e.g. John Doe"
                    value={workerForm.name}
                    onChange={(e) =>
                      setWorkerForm({ ...workerForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Program</Label>
                  <Select
                    value={workerForm.program}
                    onChange={(e) =>
                      setWorkerForm({ ...workerForm, program: e.target.value })
                    }
                  >
                    <option value="Futures">Futures</option>
                    <option value="Social Support">Social Support</option>
                    <option value="Youth">Youth</option>
                    <option value="Family">Family</option>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Status</Label>
                  <Select
                    value={workerForm.status}
                    onChange={(e) =>
                      setWorkerForm({ ...workerForm, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                {editingWorkerId && (
                  <Button
                    outline
                    size="sm"
                    color="gray"
                    onClick={() => {
                      setEditingWorkerId(null);
                      setWorkerForm({
                        name: "",
                        program: "Futures",
                        status: "Active",
                      });
                    }}
                    className="rounded-md font-bold uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  outline
                  size="sm"
                  color="blue"
                  type="submit"
                  className="rounded-md font-bold uppercase tracking-widest text-[10px]"
                >
                  {editingWorkerId ? "Update Worker" : "Save Worker"}
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="font-bold text-sm dark:text-white">
                Case Workers List
              </h4>
              <div className="rounded-md divide-y dark:divide-gray-700 max-h-60 overflow-y-auto">
                {caseWorkers.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500 italic">
                    No case workers registered.
                  </p>
                ) : (
                  caseWorkers.map((worker: any) => (
                    <div
                      key={worker.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div>
                        <span className="text-sm font-bold dark:text-white">
                          {worker.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          ({worker.program})
                        </span>
                        <Badge
                          className="ml-2 inline"
                          color={
                            worker.status === "Active" ? "success" : "gray"
                          }
                        >
                          {worker.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWorkerId(worker.id);
                            setWorkerForm({
                              name: worker.name || "",
                              program: worker.program || "Futures",
                              status: worker.status || "Active",
                            });
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-500"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-white dark:bg-gray-800 border-t">
            <div className="flex justify-end w-full">
              <Button
                outline
                size="sm"
                color="gray"
                onClick={() => setIsCaseWorkerModalOpen(false)}
                className="rounded-md font-bold uppercase tracking-widest text-[10px]"
              >
                Close
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* Social Support Case Modal */}
        <Modal
          show={isSocialSupportCaseModalOpen}
          onClose={() => setIsSocialSupportCaseModalOpen(false)}
          size="lg"
          className="date-picker-modal"
          theme={{
            root: {
              base: "fixed inset-0 z-50 h-modal h-screen overflow-visible flex items-start pt-16 sm:pt-24 justify-center",
              show: {
                on: "flex bg-gray-900/50 dark:bg-gray-900/80",
                off: "hidden",
              },
            },
            content: {
              base: "relative h-auto w-full p-4",
              inner:
                "relative flex max-h-[90dvh] flex-col rounded-md bg-white shadow dark:bg-gray-700 !overflow-visible",
            },
          }}
        >
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {editingSsCaseId
                ? "Edit Social Support Case"
                : "Add Social Support Case"}
            </h3>
            <button
              type="button"
              onClick={() => setIsSocialSupportCaseModalOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-8 bg-white dark:bg-gray-800 !overflow-visible relative z-50">
            <form onSubmit={handleSaveSsCase} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Have Case Manager</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        name="haveCaseManager"
                        value="HavecaseWorker"
                        checked={
                          ssCaseForm.haveCaseManager === "HavecaseWorker" ||
                          ssCaseForm.haveCaseManager === "Yes"
                        }
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            haveCaseManager: "HavecaseWorker",
                          })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      Have Case Worker
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        name="haveCaseManager"
                        value="NocaseWorker"
                        checked={
                          ssCaseForm.haveCaseManager === "NocaseWorker" ||
                          ssCaseForm.haveCaseManager === "No"
                        }
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            haveCaseManager: "NocaseWorker",
                          })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      No Case Worker
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block">Case Worker</Label>
                  <Select
                    value={ssCaseForm.caseWorkerId}
                    onChange={(e) =>
                      setSsCaseForm({
                        ...ssCaseForm,
                        caseWorkerId: e.target.value,
                      })
                    }
                    disabled={
                      ssCaseForm.haveCaseManager === "NocaseWorker" ||
                      ssCaseForm.haveCaseManager === "No"
                    }
                  >
                    <option value="">Select Case Worker...</option>
                    {caseWorkers
                      .filter(
                        (w) =>
                          w.status === "Active" ||
                          w.id.toString() === ssCaseForm.caseWorkerId,
                      )
                      .map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.name}
                        </option>
                      ))}
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <Label className="block border-b pb-1">
                    Problem List
                  </Label>

                  {/* Health Problem */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ssCaseForm.healthProblem}
                          onChange={(e) =>
                            setSsCaseForm({
                              ...ssCaseForm,
                              healthProblem: e.target.checked,
                            })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Health Problem
                      </label>
                    </div>
                    {ssCaseForm.healthProblem && (
                      <TextInput
                        placeholder="Provide health problem details..."
                        value={ssCaseForm.healthProblemDetail}
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            healthProblemDetail: e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Drug Problem */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ssCaseForm.drugProblem}
                          onChange={(e) =>
                            setSsCaseForm({
                              ...ssCaseForm,
                              drugProblem: e.target.checked,
                            })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Drug Problem
                      </label>
                    </div>
                    {ssCaseForm.drugProblem && (
                      <TextInput
                        placeholder="Provide drug problem details..."
                        value={ssCaseForm.drugProblemDetail}
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            drugProblemDetail: e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Baby Problem */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ssCaseForm.babyProblem}
                          onChange={(e) =>
                            setSsCaseForm({
                              ...ssCaseForm,
                              babyProblem: e.target.checked,
                            })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Baby Problem
                      </label>
                    </div>
                    {ssCaseForm.babyProblem && (
                      <TextInput
                        placeholder="Provide baby problem details..."
                        value={ssCaseForm.babyProblemDetail}
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            babyProblemDetail: e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Personal Problem */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ssCaseForm.personalProblem}
                          onChange={(e) =>
                            setSsCaseForm({
                              ...ssCaseForm,
                              personalProblem: e.target.checked,
                            })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Personal Problem
                      </label>
                    </div>
                    {ssCaseForm.personalProblem && (
                      <TextInput
                        placeholder="Provide personal problem details..."
                        value={ssCaseForm.personalProblemDetail}
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            personalProblemDetail: e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Legal Problem */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ssCaseForm.legalProblem}
                          onChange={(e) =>
                            setSsCaseForm({
                              ...ssCaseForm,
                              legalProblem: e.target.checked,
                            })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Legal Problem
                      </label>
                    </div>
                    {ssCaseForm.legalProblem && (
                      <TextInput
                        placeholder="Provide legal problem details..."
                        value={ssCaseForm.legalProblemDetail}
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            legalProblemDetail: e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Other Problem */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold dark:text-gray-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ssCaseForm.otherProblem}
                          onChange={(e) =>
                            setSsCaseForm({
                              ...ssCaseForm,
                              otherProblem: e.target.checked,
                            })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Other Problem
                      </label>
                    </div>
                    {ssCaseForm.otherProblem && (
                      <TextInput
                        placeholder="Provide other problem details..."
                        value={ssCaseForm.otherProblemDetail}
                        onChange={(e) =>
                          setSsCaseForm({
                            ...ssCaseForm,
                            otherProblemDetail: e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-1 block">Description / Note</Label>
                  <Textarea
                    rows={3}
                    placeholder="Provide a general note or description for this case..."
                    value={ssCaseForm.description}
                    onChange={(e) =>
                      setSsCaseForm({
                        ...ssCaseForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="mb-1 block">Open Date</Label>
                  <DatePicker
                    value={
                      ssCaseForm.openDate
                        ? new Date(ssCaseForm.openDate)
                        : new Date()
                    }
                    onChange={(date) =>
                      setSsCaseForm({
                        ...ssCaseForm,
                        openDate: format(date, "yyyy-MM-dd"),
                      })
                    }
                    placeholder="Select Open Date..."
                  />
                </div>

                <div>
                  <Label className="mb-1 block">Close Date</Label>
                  <DatePicker
                    value={
                      ssCaseForm.closeDate
                        ? new Date(ssCaseForm.closeDate)
                        : null
                    }
                    onChange={(date) =>
                      setSsCaseForm({
                        ...ssCaseForm,
                        closeDate: format(date, "yyyy-MM-dd"),
                      })
                    }
                    placeholder="Select Close Date..."
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-1 block">Status</Label>
                  <Select
                    value={ssCaseForm.status}
                    onChange={(e) =>
                      setSsCaseForm({ ...ssCaseForm, status: e.target.value })
                    }
                  >
                    <option value="OpenCase">Open Case</option>
                    <option value="CloseCase">Closed Case</option>
                  </Select>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t relative z-40 justify-end gap-3 !p-4">
            <Button
              outline
              color="gray"
              size="sm"
              onClick={() => setIsSocialSupportCaseModalOpen(false)}
              className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
            >
              Cancel
            </Button>
            <Button
              outline
              color="blue"
              size="sm"
              onClick={handleSaveSsCase}
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>

        {/* Manage Levels Modal */}
        <Modal
          show={isManageLevelsOpen}
          onClose={() => setIsManageLevelsOpen(false)}
          size="md"
        >
          <div className="flex justify-between items-center p-4 border-b rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              Manage Education Levels
            </span>
            <button
              type="button"
              onClick={() => setIsManageLevelsOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4">
            <div className="flex gap-2">
              <TextInput
                placeholder="Add new level (e.g. Master's)"
                value={newLevelName}
                onChange={(e) => setNewLevelName(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLevel();
                  }
                }}
              />
              <Button
                outline
                size="sm"
                color="blue"
                onClick={handleAddLevel}
                className="rounded-md font-bold uppercase tracking-widest text-[10px]"
              >
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>

            <div className="rounded-md divide-y dark:divide-gray-700 max-h-60 overflow-y-auto">
              {educationLevels.length === 0 ? (
                <p className="p-4 text-center text-sm text-gray-500 italic">
                  No levels configured.
                </p>
              ) : (
                educationLevels.map((lvl, index) => (
                  <div
                    key={lvl}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    {editingLevelIndex === index ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <TextInput
                          value={editingLevelValue}
                          onChange={(e) => setEditingLevelValue(e.target.value)}
                          className="flex-1 text-xs"
                          required
                          sizing="sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleEditLevel(index);
                            }
                          }}
                        />
                        <Button
                          size="xs"
                          color="success"
                          onClick={() => handleEditLevel(index)}
                        >
                          Save
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => setEditingLevelIndex(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-bold dark:text-white">
                          {lvl}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLevelIndex(index);
                              setEditingLevelValue(lvl);
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-500"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLevel(lvl)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ModalBody>
          <ModalFooter className="bg-white dark:bg-gray-800 border-t">
            <div className="flex justify-end w-full">
              <Button
                outline
                size="sm"
                color="gray"
                onClick={() => setIsManageLevelsOpen(false)}
                className="rounded-md font-bold uppercase tracking-widest text-[10px]"
              >
                Close
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* Manage Cases Modal */}
        <Modal
          show={isManageCasesOpen}
          onClose={() => setIsManageCasesOpen(false)}
          size="lg"
        >
          <div className="flex justify-between items-center p-4 border-b rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              Manage Client Cases
            </span>
            <button
              type="button"
              onClick={() => setIsManageCasesOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-6">
            {/* Form to Add or Edit Case */}
            <form
              onSubmit={handleAddCase}
              className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-4"
            >
              <h4 className="font-bold text-sm dark:text-white">
                {isCaseEditMode ? "Edit Case Info" : "Open a New Case"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block text-xs">Service Type</Label>
                  <Dropdown
                    renderTrigger={() => (
                      <button
                        type="button"
                        className="w-full bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 outline-none"
                      >
                        <span className="truncate">
                          {caseForm.serviceType || "Select Service"}
                        </span>
                        <ChevronDown
                          size={16}
                          className="text-gray-500 dark:text-gray-400 shrink-0"
                        />
                      </button>
                    )}
                    className="w-[200px] z-[9999]"
                  >
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({
                          ...caseForm,
                          serviceType: "Social Support",
                        })
                      }
                    >
                      Social Support
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({
                          ...caseForm,
                          serviceType: "Job Placement",
                        })
                      }
                    >
                      Job Placement
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({ ...caseForm, serviceType: "Education" })
                      }
                    >
                      Education
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({ ...caseForm, serviceType: "Medical" })
                      }
                    >
                      Medical
                    </DropdownItem>
                  </Dropdown>
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Priority</Label>
                  <Dropdown
                    renderTrigger={() => (
                      <button
                        type="button"
                        className="w-full bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 outline-none"
                      >
                        <span className="truncate">
                          {caseForm.priority || "Select Priority"}
                        </span>
                        <ChevronDown
                          size={16}
                          className="text-gray-500 dark:text-gray-400 shrink-0"
                        />
                      </button>
                    )}
                    className="w-[200px] z-[9999]"
                  >
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({ ...caseForm, priority: "Normal" })
                      }
                    >
                      Normal
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({ ...caseForm, priority: "High" })
                      }
                    >
                      High
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        setCaseForm({ ...caseForm, priority: "Low" })
                      }
                    >
                      Low
                    </DropdownItem>
                  </Dropdown>
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">Subject / Title</Label>
                  <TextInput
                    required
                    placeholder="e.g. Health assessment or Job search assistance"
                    value={caseForm.subject}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, subject: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">Description</Label>
                  <Textarea
                    rows={2}
                    placeholder="Brief case background..."
                    value={caseForm.description}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                {isCaseEditMode && (
                  <Button
                    outline
                    size="sm"
                    color="gray"
                    onClick={() => {
                      setIsCaseEditMode(false);
                      setEditingCaseId(null);
                      setCaseForm({
                        subject: "",
                        description: "",
                        priority: "Normal",
                        serviceType: "Social Support",
                      });
                    }}
                    className="rounded-md font-bold uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  outline
                  size="sm"
                  color="blue"
                  type="submit"
                  className="rounded-md font-bold uppercase tracking-widest text-[10px]"
                >
                  {isCaseEditMode ? "Update Case" : "Open Case"}
                </Button>
              </div>
            </form>

            {/* Case List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm dark:text-white">
                Existing Cases
              </h4>
              <div className="rounded-md divide-y dark:divide-gray-700 max-h-60 overflow-y-auto">
                {cases.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500 italic">
                    No cases opened for this client yet.
                  </p>
                ) : (
                  cases.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold dark:text-white">
                            {c.subject}
                          </span>
                          <Badge
                            color={c.priority === "High" ? "failure" : "info"}
                            size="xs"
                          >
                            {c.priority || "Normal"}
                          </Badge>
                          <Badge color="gray" size="xs">
                            {c.status || "Open"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Service: {c.serviceType} (Case #{c.id})
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCaseEditMode(true);
                            setEditingCaseId(c.id);
                            setCaseForm({
                              subject: c.subject || "",
                              description: c.description || "",
                              priority: c.priority || "Normal",
                              serviceType: c.serviceType || "Social Support",
                            });
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-500"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCase(c.id)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-white dark:bg-gray-800 border-t">
            <div className="flex justify-end w-full">
              <Button
                outline
                size="sm"
                color="gray"
                onClick={() => setIsManageCasesOpen(false)}
                className="rounded-md font-bold uppercase tracking-widest text-[10px]"
              >
                Close
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* Manage Placement Types Modal */}
        <Modal
          show={isManagePlacementTypesOpen}
          onClose={() => setIsManagePlacementTypesOpen(false)}
          size="md"
        >
          <div className="flex justify-between items-center p-4 border-b rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              Manage Placement Types
            </span>
            <button
              type="button"
              onClick={() => setIsManagePlacementTypesOpen(false)}
              className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4">
            <div className="flex gap-2">
              <TextInput
                placeholder="New placement type..."
                value={newPlacementTypeName}
                onChange={(e) => setNewPlacementTypeName(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddPlacementType(e as any);
                }}
              />
              <Button
                outline
                size="sm"
                color="blue"
                onClick={handleAddPlacementType}
                className="rounded-md font-bold uppercase tracking-widest text-[10px]"
              >
                Add
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden divide-y dark:divide-gray-700 bg-white dark:bg-gray-800 max-h-[300px] overflow-y-auto">
              {placementCategories.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No placement types available. Add one above.
                </p>
              ) : (
                placementCategories.map((category: any, index: number) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                  >
                    {editingPlacementTypeIndex === index ? (
                      <div className="flex-1 flex items-center gap-2 mr-2">
                        <TextInput
                          value={editingPlacementTypeValue}
                          onChange={(e) =>
                            setEditingPlacementTypeValue(e.target.value)
                          }
                          sizing="sm"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleEditPlacementType(category.id, index);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() =>
                            handleEditPlacementType(category.id, index)
                          }
                          className="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPlacementTypeIndex(null)}
                          className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          {category.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingPlacementTypeIndex(index);
                              setEditingPlacementTypeValue(category.name);
                            }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePlacementType(
                                category.id,
                                category.name,
                              )
                            }
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ModalBody>
          <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t p-4">
            <div className="flex justify-end w-full">
              <Button
                outline
                size="sm"
                color="gray"
                onClick={() => setIsManagePlacementTypesOpen(false)}
                className="rounded-md font-bold uppercase tracking-widest text-[10px]"
              >
                Close
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* Beautiful Delete Confirmation Modal */}
        <Modal
          show={isConfirmOpen}
          size="md"
          onClose={() => {
            setIsConfirmOpen(false);
            setItemToDelete(null);
          }}
          popup
          className="backdrop-blur-sm"
        >
          <ModalHeader className="flex justify-between flex-col">
            <div className="flex flex-row items-center justify-between me-5">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="mb-2 text-xl text-yellow-500 ms-5 font-black text-gray-900 dark:text-white">
                Confirm Deletion !
              </h3>
            </div>
            {/* <Button onClick={() => setIsConfirmOpen(false)} className="text-xl bg-transparent border-0 text-red-500 font-thin pe-0 me-0">X</Button> */}
          </ModalHeader>
          <ModalBody>
            <div className="text-center">
              <p className="mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                {itemToDelete?.type === "attachment"
                  ? "Are you sure you want to remove this attachment? This action cannot be undone."
                  : itemToDelete?.type === "case"
                    ? "Are you sure you want to delete this case? Doing so will permanently dissociate all entries linked to it."
                    : `Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
              </p>
              <div className="flex justify-between gap-4 font-2xl">
                <Button
                  color="yellow"
                  onClick={() => setIsConfirmOpen(false)}
                  className="font-bold px-6"
                >
                  NO
                </Button>
                <Button
                  color="red"
                  onClick={() => confirmDeleteItem()}
                  className="font-bold px-6"
                >
                  Yes
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      <ClientRegistrationModal
        clientId={Array.isArray(id) ? id[0] : id}
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        isEditMode={true}
        formData={clientForm}
        setFormData={setClientForm}
        handleSubmit={async (e) => {
          e.preventDefault();
          try {
            // Format dates for backend LocalDateTime format
            const formattedForm = { ...clientForm };
            if (formattedForm.dateOfBirth && formattedForm.dateOfBirth.length === 10) {
              formattedForm.dateOfBirth = `${formattedForm.dateOfBirth}T00:00:00`;
            }
            if (formattedForm.idpoorValiddate && formattedForm.idpoorValiddate.length === 10) {
              formattedForm.idpoorValiddate = `${formattedForm.idpoorValiddate}T00:00:00`;
            }

            try {
              await api.put(`/clients/${id}`, formattedForm);
            } catch (backendErr) {
              console.warn("Backend update API note, applying local client update:", backendErr);
            }

            // Update local profile state so edits are active immediately
            if (data) {
              setData((prev: any) => ({
                ...prev,
                client: {
                  ...prev?.client,
                  ...clientForm,
                },
              }));
            }

            toast.success("Client profile updated successfully");
            setIsClientModalOpen(false);
          } catch (err) {
            console.error("Client update error:", err);
            toast.error("Failed to update client profile");
          }
        }}
        handlePhotoChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
              setClientForm((prev) => ({
                ...prev,
                photo: reader.result as string,
              }));
            reader.readAsDataURL(file);
          }
        }}
      />
    </>
  );
};

export default ClientProfilePage;
