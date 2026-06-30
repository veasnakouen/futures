import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from '@/lib/react-router-compat';
import {
  Card,
  Button,
  Badge,
  Spinner,
  Avatar,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  TextInput,
  Textarea,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  ToggleSwitch,
} from '@/lib/flowbite-compat';
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
import Layout from "@/components/common/Layout";
import api from "../services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { uploadToCloudinary } from "../utils/cloudinary";
import ClientRegistrationModal from "@/features/clients/components/ClientRegistrationModal";
import ClientAdvancedFeatures from "@/features/clients/components/ClientAdvancedFeatures";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
const ClientProfilePage = ({ isDark, setIsDark }: any) => {
  const { id } = useParams();
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
  const [clientForm, setClientForm] = useState({
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

      // Fetch case workers and social support cases
      const workersRes = await api.get("/case-workers");
      setCaseWorkers(workersRes.data);
      const casesRes = await api.get(`/social-support-cases/client/${id}`);
      setSocialSupportCases(casesRes.data);

      setError(null);
    } catch (err) {
      console.error("Profile load error:", err);
      setError(
        "Failed to load client portfolio. Please check your connection.",
      );
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
      <Layout isDark={isDark} setIsDark={setIsDark} title="Client Portfolio">
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-500 font-medium animate-pulse">
            Building 360° Portfolio View...
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Error">
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
      </Layout>
    );
  }

  const { client, cases, placements, socialSupports, educations } = data;

  return (
    <Layout
      isDark={isDark}
      setIsDark={setIsDark}
      title={`${client.firstName} ${client.lastName}`}
    >
      <div className="space-y-6 animate-fade-in pb-20">
        {/* Back Navigation Button */}
        <div className="flex justify-start">
          <Button
            color="light"
            onClick={() => navigate("/clients")}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs"
          >
            <ArrowLeft
              size={16}
              className="mr-2 text-blue-600 dark:text-blue-400"
            />{" "}
            Back to Client Directory
          </Button>
        </div>

        {/* Header / Summary Card */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-36 rounded-lg shadow-lg"></div>
          <div className="px-4 -mt-14">
            <Card className="rounded-lg border-none shadow-2xl dark:bg-gray-800">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-xl transition-transform duration-300 transform hover:scale-105 bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      {client.photo ? (
                        <img
                          src={client.photo}
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {client.firstName[0] + client.lastName[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                        {client.firstName} {client.lastName}
                      </h2>
                      <Badge
                        color={
                          client.status === "Active" ? "success" : "warning"
                        }
                        className="rounded-full px-3 py-1 font-bold"
                      >
                        {client.status || "Active"}
                      </Badge>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-xs uppercase flex items-center gap-2 justify-center md:justify-start">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                        {client.clientCode}
                      </span>
                      • Registered{" "}
                      {client.registerDate
                        ? format(new Date(client.registerDate), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto items-stretch">
                  <Button
                    color="blue"
                    onClick={() => navigate(`/clients/${id}/cv`)}
                    className="rounded-lg flex-1 md:flex-none shadow-lg shadow-blue-500/20 h-[42px]"
                  >
                    <FileText size={18} className="mr-2" /> Generate CV
                  </Button>
                  <Dropdown
                    renderTrigger={() => (
                      <Button
                        color="gray"
                        className="rounded-lg flex-1 md:flex-none h-[42px]"
                      >
                        <MoreVertical size={18} />
                      </Button>
                    )}
                    placement="bottom-end"
                  >
                    <DropdownItem
                      onClick={() => {
                        let safeDob = "";
                        if (client.dateOfBirth) {
                          try {
                            safeDob = new Date(client.dateOfBirth)
                              .toISOString()
                              .split("T")[0];
                          } catch (e) {
                            safeDob = "";
                          }
                        }
                        let safeIdPoor = "";
                        if (client.idpoorValiddate) {
                          try {
                            safeIdPoor = new Date(client.idpoorValiddate)
                              .toISOString()
                              .split("T")[0];
                          } catch (e) {
                            safeIdPoor = "";
                          }
                        }

                        setClientForm({
                          ...client,
                          dateOfBirth: safeDob,
                          idpoorValiddate: safeIdPoor,
                        });
                        setIsClientModalOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => window.print()}>
                      <FileText className="mr-2 h-4 w-4" /> Print Profile
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      onClick={() => handleDeleteItem("profile", 0)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t dark:border-gray-700">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Phone size={12} /> Phone Number
                  </p>
                  <p className="text-sm font-bold dark:text-gray-200">
                    {client.contactPhone || "No contact"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Mail size={12} /> Email Address
                  </p>
                  <p className="text-sm font-bold dark:text-gray-200 truncate">
                    {client.email || "None"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={12} /> Location
                  </p>
                  <p className="text-sm font-bold dark:text-gray-200">
                    {client.province || client.address || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={12} /> Date of Birth
                  </p>
                  <p className="text-sm font-bold dark:text-gray-200">
                    {client.dateOfBirth
                      ? format(new Date(client.dateOfBirth), "dd MMM yyyy")
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="px-4 mt-8 mb-6">
          <ModernTabs
            tabs={["Overview", "Social Support", "CV & Education"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="animate-fade-in">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-3">
              {/* Left: Quick Stats & Timeline */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <History className="text-blue-600" /> Interaction Timeline
                  </h3>
                  <div className="relative pl-8 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                    {cases.map((c: any, i: number) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 text-blue-600">
                          <ShieldCheck size={10} />
                        </div>
                        <div>
                          <p className="font-bold text-[10px] uppercase tracking-widest text-blue-500 mb-1">
                            {format(new Date(c.openDate), "MMM dd, yyyy")}
                          </p>
                          <h4 className="text-base font-black dark:text-white mb-1">
                            {c.serviceType}: {c.subject}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {c.description}
                          </p>
                          <Badge color="info" className="mt-2 inline-flex">
                            {c.status || "Open"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 text-gray-500">
                        <User size={10} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                          {client.registerDate
                            ? format(
                                new Date(client.registerDate),
                                "MMM dd, yyyy",
                              )
                            : "N/A"}
                        </p>
                        <h4 className="text-base font-black dark:text-white">
                          Account Created
                        </h4>
                        <p className="text-sm text-gray-500">
                          Initial registration in {client.branch} branch.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="text-emerald-500" /> Placement
                      History
                    </h3>
                    <Button
                      size="xs"
                      onClick={() => {
                        setIsEditMode(false);
                        setPlacementForm({
                          clientId: id,
                          companyName: "",
                          salary: "",
                          placementDate: new Date().toISOString().split("T")[0],
                          status: "Active",
                          placementType: placementTypes[0] || "Employment",
                        });
                        setIsPlacementModalOpen(true);
                      }}
                      className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 border-none transition-colors"
                    >
                      <Plus size={16} className="mr-1" /> Record Placement
                    </Button>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
                    <Table
                      hoverable
                      className="border-none w-full min-w-[600px] relative"
                    >
                      <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-xs text-gray-500 uppercase dark:text-gray-400 border-b dark:border-gray-700 sticky top-0 z-20 backdrop-blur-md shadow-sm">
                        <TableHeadCell className="px-6 py-4 font-bold">
                          Company
                        </TableHeadCell>
                        <TableHeadCell className="px-6 py-4 font-bold">
                          Date
                        </TableHeadCell>
                        <TableHeadCell className="px-6 py-4 font-bold">
                          Salary
                        </TableHeadCell>
                        <TableHeadCell className="px-6 py-4 font-bold">
                          Status
                        </TableHeadCell>
                        <TableHeadCell className="px-6 py-4 font-bold text-right">
                          Actions
                        </TableHeadCell>
                      </TableHead>
                      <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {placements.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-gray-400 italic"
                            >
                              No placements recorded.
                            </TableCell>
                          </TableRow>
                        ) : (
                          placements.map((p: any, i: number) => (
                            <TableRow
                              key={i}
                              className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <TableCell className="px-6 py-4 font-bold dark:text-white">
                                {p.companyName || "N/A"}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-xs">
                                {p.placementDate
                                  ? format(
                                      new Date(p.placementDate),
                                      "MMM yyyy",
                                    )
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {p.salary || "N/A"}
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <Badge
                                  color={
                                    p.status === "Active" ? "success" : "gray"
                                  }
                                >
                                  {p.status || "Unknown"}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setPlacementForm({
                                        clientId: p.clientId,
                                        companyName: p.companyName || "",
                                        salary: p.salary || "",
                                        placementDate: p.placementDate
                                          ? p.placementDate.split(" ")[0]
                                          : "",
                                        status: p.status || "Active",
                                        placementType:
                                          p.placementType || "Employment",
                                      });
                                      setEditingId(p.id);
                                      setIsEditMode(true);
                                      setIsPlacementModalOpen(true);
                                    }}
                                    className="p-2 text-blue-400 hover:text-blue-600"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteItem("placement", p.id)
                                    }
                                    className="p-2 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>

              {/* Right: Personal Details & Documents */}
              <div className="space-y-4">
                <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">
                    Vital Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Gender
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.gender}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Marital Status
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.maritalStatus || "Single"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        ID Card
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200 font-mono">
                        {client.idCard || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Nationality
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.nationality || "Khmer"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Physical
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.height || "-"} cm / {client.weight || "-"} kg
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">
                      Attachments
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Photo ID",
                        icon: <User />,
                        color: "blue",
                        field: "photoIdAttachment",
                      },
                      {
                        label: "Contract",
                        icon: <FileText />,
                        color: "emerald",
                        field: "contractAttachment",
                      },
                      {
                        label: "ID Poor",
                        icon: <Award />,
                        color: "orange",
                        field: "idPoorAttachment",
                      },
                      {
                        label: "CV",
                        icon: <GraduationCap />,
                        color: "violet",
                        field: "cvAttachment",
                      },
                    ].map((doc, i) => {
                      const fileUrl = client[doc.field];
                      const isCardUploading = isUploading[doc.field];
                      return (
                        <div key={i} className="relative">
                          {/* Hidden File Input */}
                          <input
                            type="file"
                            id={`upload-${doc.field}`}
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadAttachment(doc.field, file);
                              }
                            }}
                          />

                          {/* Card wrapper */}
                          <div
                            onClick={() => {
                              if (fileUrl) {
                                window.open(fileUrl, "_blank");
                              } else {
                                document
                                  .getElementById(`upload-${doc.field}`)
                                  ?.click();
                              }
                            }}
                            className={`p-4 rounded-lg border flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                              fileUrl
                                ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 hover:border-green-400"
                                : "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600 hover:border-blue-400"
                            }`}
                          >
                            {/* Action Buttons Overlay */}
                            {fileUrl && (
                              <div className="absolute top-2 right-2 flex gap-1 z-10">
                                {/* Download Button */}
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const filename = `${doc.label.replace(/\\s+/g, "_")}_attachment`;

                                    // For Cloudinary URLs, use the fl_attachment transformation to force download
                                    if (
                                      fileUrl.includes("res.cloudinary.com") &&
                                      fileUrl.includes("/upload/")
                                    ) {
                                      const downloadUrl = fileUrl.replace(
                                        "/upload/",
                                        `/upload/fl_attachment:${filename}/`,
                                      );
                                      const link = document.createElement("a");
                                      link.href = downloadUrl;
                                      link.download = filename;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      return;
                                    }

                                    // Fallback for other URLs: try fetch to create a local blob
                                    try {
                                      const response = await fetch(fileUrl);
                                      if (!response.ok)
                                        throw new Error(
                                          "Network response was not ok",
                                        );
                                      const blob = await response.blob();
                                      const blobUrl =
                                        window.URL.createObjectURL(blob);
                                      const link = document.createElement("a");
                                      link.href = blobUrl;
                                      link.download = filename;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      setTimeout(
                                        () =>
                                          window.URL.revokeObjectURL(blobUrl),
                                        100,
                                      );
                                    } catch (error) {
                                      console.error(
                                        "Download failed, opening in new tab",
                                        error,
                                      );
                                      window.open(fileUrl, "_blank");
                                    }
                                  }}
                                  className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                                  title="Download Attachment"
                                >
                                  <Download size={12} />
                                </button>
                                {/* Edit / Replace Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document
                                      .getElementById(`upload-${doc.field}`)
                                      ?.click();
                                  }}
                                  className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                                  title="Replace Attachment"
                                >
                                  <Edit size={12} />
                                </button>
                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAttachment(doc.field);
                                  }}
                                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                                  title="Delete Attachment"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}

                            {/* Icon */}
                            <div
                              className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110 ${
                                fileUrl
                                  ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {isCardUploading ? (
                                <Spinner size="sm" />
                              ) : (
                                doc.icon
                              )}
                            </div>

                            {/* Label & Status */}
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              {doc.label}
                            </span>
                            <span
                              className={`text-[9px] font-bold ${fileUrl ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}
                            >
                              {isCardUploading
                                ? "Uploading..."
                                : fileUrl
                                  ? "Attached (Click to view)"
                                  : "Not Attached"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "Social Support" && (
            <div className="pt-3 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">
                  Social Support History
                </h3>
                <div className="flex gap-2">
                  <Button
                    color="gray"
                    onClick={() => {
                      setWorkerForm({
                        name: "",
                        program: "Futures",
                        status: "Active",
                      });
                      setEditingWorkerId(null);
                      setIsCaseWorkerModalOpen(true);
                    }}
                    className="rounded-lg shadow-sm"
                  >
                    Add Case Worker
                  </Button>
                  <Button
                    color="blue"
                    onClick={() => {
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
                      setEditingSsCaseId(null);
                      setIsSocialSupportCaseModalOpen(true);
                    }}
                    className="rounded-lg shadow-lg shadow-blue-500/20"
                  >
                    <Plus size={18} className="mr-2" /> Add Social Support
                  </Button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
                  <Table
                    hoverable
                    className="border-none w-full min-w-[850px] relative"
                  >
                    <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-xs text-gray-500 uppercase dark:text-gray-400 border-b dark:border-gray-700 sticky top-0 z-20 backdrop-blur-md shadow-sm">
                      <TableHeadCell className="px-6 py-4 font-bold">
                        ID
                      </TableHeadCell>
                      <TableHeadCell className="px-6 py-4 font-bold">
                        Have case
                      </TableHeadCell>
                      <TableHeadCell className="px-6 py-4 font-bold">
                        Case worker
                      </TableHeadCell>
                      <TableHeadCell className="px-6 py-4 font-bold">
                        Open date
                      </TableHeadCell>
                      <TableHeadCell className="px-6 py-4 font-bold">
                        Close date
                      </TableHeadCell>
                      <TableHeadCell className="px-6 py-4 font-bold">
                        Problem
                      </TableHeadCell>
                      <TableHeadCell className="px-6 py-4 font-bold text-right">
                        Action
                      </TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {socialSupportCases.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-400 italic"
                          >
                            No social support cases recorded.
                          </TableCell>
                        </TableRow>
                      ) : (
                        socialSupportCases.map((c: any, index: number) => {
                          const problems = getProblemsList(c.id);
                          return (
                            <TableRow
                              key={c.id || index}
                              className="dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <TableCell className="px-6 py-4 font-bold dark:text-white">
                                {c.id}
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <Badge
                                  color={
                                    c.haveCaseManager === "HavecaseWorker" ||
                                    c.haveCaseManager === "Yes"
                                      ? "success"
                                      : "gray"
                                  }
                                >
                                  {c.haveCaseManager === "HavecaseWorker" ||
                                  c.haveCaseManager === "Yes"
                                    ? "Yes"
                                    : "No"}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-4 dark:text-gray-200">
                                {c.caseWorker?.name || "N/A"}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-xs dark:text-gray-200">
                                {c.openDate
                                  ? format(new Date(c.openDate), "MMM dd, yyyy")
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-xs dark:text-gray-200">
                                {c.closeDate
                                  ? format(
                                      new Date(c.closeDate),
                                      "MMM dd, yyyy",
                                    )
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {problems === "None" ? (
                                    <span className="text-xs text-gray-400 italic">
                                      None
                                    </span>
                                  ) : (
                                    problems.split(", ").map((p, pidx) => (
                                      <Badge
                                        key={pidx}
                                        color="failure"
                                        size="xs"
                                      >
                                        {p}
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => handleEditSsCase(c)}
                                    className="p-2 text-blue-400 hover:text-blue-600"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSsCase(c.id)}
                                    className="p-2 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "CV & Education" && (
            <div className="pt-3 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">
                  Academic & Professional Development
                </h3>
                <Button
                  color="indigo"
                  onClick={() => {
                    setIsEditMode(false);
                    setEducationForm({
                      clientId: id,
                      schoolName: "",
                      currentLevel: educationLevels[0] || "High School",
                      status: "Completed",
                    });
                    setIsEducationModalOpen(true);
                  }}
                  className="rounded-lg shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={18} className="mr-2" /> Add Education Record
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educations?.map((edu: any, i: number) => (
                  <Card
                    key={i}
                    className="rounded-lg border-none shadow-lg dark:bg-gray-800 group relative"
                  >
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEducationForm({
                            clientId: edu.clientId,
                            schoolName: edu.schoolName || "",
                            currentLevel: edu.currentLevel || "High School",
                            status: edu.status || "Completed",
                          });
                          setEditingId(edu.id);
                          setIsEditMode(true);
                          setIsEducationModalOpen(true);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem("education", edu.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white">
                          {edu.schoolName || "Unknown Institution"}
                        </h4>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                          {edu.currentLevel || "Unspecified Level"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
                {(educations?.length === 0 || !educations) && (
                  <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <GraduationCap
                      size={48}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 font-bold">
                      Education history is currently empty.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- MODALS --- */}

        {/* Placement Modal */}
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
          <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Placement" : "Record New Placement"}
            </h3>
            <button
              type="button"
              onClick={() => setIsPlacementModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 relative z-40 justify-end gap-3 !p-4">
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
          <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Assessment" : "New Support Entry"}
            </h3>
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
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

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
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
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 justify-end gap-3 !p-4">
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
          <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Education" : "Add Education"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEducationModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 justify-end gap-3 !p-4">
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
          <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              Manage Case Workers
            </h3>
            <button
              type="button"
              onClick={() => setIsCaseWorkerModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-6">
            <form
              onSubmit={handleSaveWorker}
              className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-4 border dark:border-gray-700"
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
              <div className="border rounded-md divide-y dark:border-gray-700 dark:divide-gray-700 max-h-60 overflow-y-auto">
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
          <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
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
          <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {editingSsCaseId
                ? "Edit Social Support Case"
                : "Add Social Support Case"}
            </h3>
            <button
              type="button"
              onClick={() => setIsSocialSupportCaseModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
                  <Label className="block border-b pb-1 dark:border-gray-700">
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
          <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 relative z-40 justify-end gap-3 !p-4">
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
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              Manage Education Levels
            </span>
            <button
              type="button"
              onClick={() => setIsManageLevelsOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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

            <div className="border rounded-md divide-y dark:border-gray-700 dark:divide-gray-700 max-h-60 overflow-y-auto">
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
          <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
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
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              Manage Client Cases
            </span>
            <button
              type="button"
              onClick={() => setIsManageCasesOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
          <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-6">
            {/* Form to Add or Edit Case */}
            <form
              onSubmit={handleAddCase}
              className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-4 border dark:border-gray-700"
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
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 outline-none"
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
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 outline-none"
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
              <div className="border rounded-md divide-y dark:border-gray-700 dark:divide-gray-700 max-h-60 overflow-y-auto">
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
          <ModalFooter className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
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
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 rounded-t-md bg-white dark:bg-gray-800">
            <span className="text-lg font-bold dark:text-white">
              Manage Placement Types
            </span>
            <button
              type="button"
              onClick={() => setIsManagePlacementTypesOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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

            <div className="border dark:border-gray-700 rounded-lg overflow-hidden divide-y dark:divide-gray-700 bg-white dark:bg-gray-800 max-h-[300px] overflow-y-auto">
              {placementCategories.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No placement types available. Add one above.
                </p>
              ) : (
                placementCategories.map((category: any, index: number) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 group"
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
          <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 p-4">
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
      </div>
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
            await api.put(`/clients/${id}`, clientForm);
            toast.success("Client profile updated");
            setIsClientModalOpen(false);
            fetchProfile();
          } catch (err) {
            toast.error("Failed to update client");
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
    </Layout>
  );
};

export default ClientProfilePage;
