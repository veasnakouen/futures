import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from '@/lib/react-router-compat';
import {Button, Badge, Spinner, Avatar, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Select, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Dropdown, DropdownItem, DropdownDivider, ToggleSwitch, Checkbox, Datepicker} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import ModernPagination from '@/components/common/ModernPagination';
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
import Layout from "../../../components/common/Layout";
import api from '@/services/api';
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { uploadToCloudinary } from '@/utils/cloudinary';

import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from '../../../queryClient';
export default function ClientAdvancedFeatures({
  clientId,
  onClose,
  formData,
}: {
  clientId: number | string;
  onClose?: () => void;
  formData?: any;
}) {
  const id = clientId.toString();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const [educationLevels, setEducationLevels] = useState<string[]>(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).getItem("mtp_education_levels");
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
  const [customFields, setCustomFields] = useState<
    { key: string; value: string }[]
  >([]);

  useEffect(() => {
    if (data?.client?.customFields) {
      try {
        setCustomFields(JSON.parse(data.client.customFields));
      } catch (e) {
        setCustomFields([]);
      }
    } else {
      setCustomFields([]);
    }
  }, [data?.client]);

  const [isManageCasesOpen, setIsManageCasesOpen] = useState(false);

  // Job Expectations state
  const [isJobExpModalOpen, setIsJobExpModalOpen] = useState(false);
  const [jobExpEditId, setJobExpEditId] = useState<number | null>(null);
  const [jobExpForm, setJobExpForm] = useState({
    clientId: id,
    employmentType: "Full-time",
    salaryExpectation: "",
    availableTime: "",
    note: "",
  });

  // Beneficiary (Dependents) state
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [beneficiaryEditId, setBeneficiaryEditId] = useState<number | null>(
    null,
  );
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    clientId: id,
    gender: "Male",
    age: "",
  });

  // CV new states
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [langEditId, setLangEditId] = useState<number | null>(null);
  const [langForm, setLangForm] = useState({
    clientId: id,
    name: "",
    level: "Intermediate",
  });

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillEditId, setSkillEditId] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState({
    clientId: id,
    skill: "",
    level: "Intermediate",
    certified: "No",
    description: "",
  });

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expEditId, setExpEditId] = useState<number | null>(null);
  const [expForm, setExpForm] = useState({
    clientId: id,
    employer: "",
    duration: "",
    description: "",
  });

  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false);
  const [personalityEditId, setPersonalityEditId] = useState<number | null>(
    null,
  );
  const [personalityForm, setPersonalityForm] = useState({
    clientId: id,
    strength: "",
    weakness: "",
  });

  // Monitoring state
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);
  const [monitoringEditId, setMonitoringEditId] = useState<number | null>(null);
  const [monitoringForm, setMonitoringForm] = useState({
    clientId: id,
    monitoringDate: "",
    nextMonitoringDate: "",
    monitoringtype: "Monthly",
    monitoringTime: "00:00",
    enroll: "Enrolled",
    type: "General",
  });
  const [monitoringSearchTerm, setMonitoringSearchTerm] = useState("");

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

  // Further Education state
  const [furtherEducationForm, setFurtherEducationForm] = useState({
    university: false,
    publicSchool: false,
    vocationalTraining: false,
    computerSchool: false,
    englishSchool: false,
    chineseSchool: false,
    availableTime: "",
  });
  const [furtherEducationReferrals, setFurtherEducationReferrals] = useState<
    any[]
  >([]);
  const [
    isFurtherEducationReferralModalOpen,
    setIsFurtherEducationReferralModalOpen,
  ] = useState(false);
  const [furtherEducationReferralForm, setFurtherEducationReferralForm] =
    useState({
      clientId: id,
      referralDate: new Date().toISOString().split("T")[0] + "T00:00:00",
      furtherEducationReferralSubjectId: "",
      provider: "",
      duration: "",
      referralBy: "",
      educationReferralSourceId: "",
      clientType: "Normal",
    });
  const [referralHistorySearchTerm, setReferralHistorySearchTerm] =
    useState("");
  const [referralSubjects, setReferralSubjects] = useState<any[]>([]);
  const [referralSources, setReferralSources] = useState<any[]>([]);
  const [isReferralSourceModalOpen, setIsReferralSourceModalOpen] =
    useState(false);
  const [referralSourceForm, setReferralSourceForm] = useState({
    referralSource: "",
    status: "Internal",
  });
  const [editingSourceId, setEditingSourceId] = useState<number | null>(null);
  const [referralSourceSearchTerm, setReferralSourceSearchTerm] = useState("");

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

  const [socialSupportCases, setSocialSupportCases] = useState<any[]>([]);
  const [caseWorkers, setCaseWorkers] = useState<any[]>([]);
  const [isCaseWorkerModalOpen, setIsCaseWorkerModalOpen] = useState(false);
  const [isSocialSupportCaseModalOpen, setIsSocialSupportCaseModalOpen] =
    useState(false);

  const [workerForm, setWorkerForm] = useState({
    name: "",
    program: "Futures",
    status: "Active",
  });
  const [editingWorkerId, setEditingWorkerId] = useState<number | null>(null);

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
  const [editingSsCaseId, setEditingSsCaseId] = useState<number | null>(null);

  // Futures Training states
  const [futuresTrainings, setFuturesTrainings] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isFuturesTrainingModalOpen, setIsFuturesTrainingModalOpen] =
    useState(false);
  const [futuresTrainingEditId, setFuturesTrainingEditId] = useState<
    number | null
  >(null);
  const [futuresTrainingForm, setFuturesTrainingForm] = useState({
    clientId: id,
    subjectId: "",
    startDate: new Date().toISOString().split("T")[0] + "T00:00:00",
    endDate: "",
    status: "Enrolled",
  });

  // Personal Profile states
  const [isPersonalProfileModalOpen, setIsPersonalProfileModalOpen] =
    useState(false);
  const [personalProfileForm, setPersonalProfileForm] = useState({
    strength: "",
    weakness: "",
    hobby: "",
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split("T")[0];
      setPlacementForm({ ...placementForm, placementDate: dateString });
    }
  };

  // Job Expectation handlers
  const handleSaveJobExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (jobExpEditId) {
        await api.put(`/job-expectations/${jobExpEditId}`, jobExpForm);
      } else {
        await api.post("/job-expectations", jobExpForm);
      }
      setIsJobExpModalOpen(false);
      toast.success("Job expectation saved");
      fetchProfile();
    } catch {
      toast.error("Failed to save job expectation");
    }
  };

  // Beneficiary handlers
  const handleSaveBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = beneficiaryEditId
        ? beneficiaryForm
        : {
          client: { id: parseInt(id) },
          gender: beneficiaryForm.gender,
          age: beneficiaryForm.age,
        };
      if (beneficiaryEditId) {
        await api.put(`/beneficiaries/${beneficiaryEditId}`, payload);
      } else {
        await api.post("/beneficiaries", payload);
      }
      setIsBeneficiaryModalOpen(false);
      toast.success("Dependent saved");
      fetchProfile();
    } catch {
      toast.error("Failed to save dependent");
    }
  };

  const handleSaveLang = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (langEditId) {
        await api.put(`/languages/${langEditId}`, langForm);
      } else {
        await api.post("/languages", langForm);
      }
      setIsLangModalOpen(false);
      toast.success("Language saved");
      fetchProfile();
    } catch {
      toast.error("Failed to save language");
    }
  };
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (skillEditId) {
        await api.put(`/computer-skills/${skillEditId}`, skillForm);
      } else {
        await api.post("/computer-skills", skillForm);
      }
      setIsSkillModalOpen(false);
      toast.success("Skill saved");
      fetchProfile();
    } catch {
      toast.error("Failed to save skill");
    }
  };
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (expEditId) {
        await api.put(`/job-experiences/${expEditId}`, expForm);
      } else {
        await api.post("/job-experiences", expForm);
      }
      setIsExpModalOpen(false);
      toast.success("Experience saved");
      fetchProfile();
    } catch {
      toast.error("Failed to save experience");
    }
  };
  const handleSavePersonality = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (personalityEditId) {
        await api.put(`/personalities/${personalityEditId}`, personalityForm);
      } else {
        await api.post("/personalities", personalityForm);
      }
      setIsPersonalityModalOpen(false);
      toast.success("Personality profile updated");
      fetchProfile();
    } catch {
      toast.error("Failed to save personality profile");
    }
  };

  const handleEditPersonalProfile = () => {
    const firstPersonality = data?.personalities && data.personalities[0];
    const firstJobExp = data?.jobExpectations && data.jobExpectations[0];
    setPersonalProfileForm({
      strength: firstPersonality?.strength || "",
      weakness: firstPersonality?.weakness || "",
      hobby: firstJobExp?.hobby || "",
    });
    setIsPersonalProfileModalOpen(true);
  };

  const handleSavePersonalProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const firstPersonality = data?.personalities && data.personalities[0];
      const firstJobExp = data?.jobExpectations && data.jobExpectations[0];

      // 1. Save strength & weakness to personalities
      if (firstPersonality?.id) {
        await api.put(`/personalities/${firstPersonality.id}`, {
          ...firstPersonality,
          strength: personalProfileForm.strength,
          weakness: personalProfileForm.weakness,
        });
      } else {
        await api.post("/personalities", {
          clientId: parseInt(id),
          strength: personalProfileForm.strength,
          weakness: personalProfileForm.weakness,
        });
      }

      // 2. Save hobby to job-expectations
      if (firstJobExp?.id) {
        await api.put(`/job-expectations/${firstJobExp.id}`, {
          ...firstJobExp,
          hobby: personalProfileForm.hobby,
        });
      } else {
        await api.post("/job-expectations", {
          clientId: parseInt(id),
          hobby: personalProfileForm.hobby,
          employmentType: "Full-time",
          salaryExpectation: "",
          availableTime: "",
          note: "",
        });
      }

      setIsPersonalProfileModalOpen(false);
      toast.success("Personal attributes and hobbies updated successfully");
      fetchProfile();
    } catch (err) {
      console.error("Failed to save personal profile", err);
      toast.error("Failed to update personal attributes");
    }
  };

  // Monitoring handlers
  const handleSaveCustomFields = async () => {
    try {
      const res = await api.get(`/clients/${id}`);
      const payload = {
        ...res.data,
        customFields: JSON.stringify(customFields),
      };
      await api.put(`/clients/${id}`, payload);
      toast.success("Custom fields saved!");
      fetchProfile();
    } catch (err: any) {
      console.error("Save custom fields error:", err.response?.data || err);
      toast.error("Failed to save custom fields");
    }
  };

  const handleSaveMonitoring = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (monitoringEditId) {
        const payload = {
          ...monitoringForm,
          monitoringDate: monitoringForm.monitoringDate.includes("T")
            ? monitoringForm.monitoringDate
            : monitoringForm.monitoringDate + "T00:00:00",
          nextMonitoringDate: monitoringForm.nextMonitoringDate
            ? monitoringForm.nextMonitoringDate.includes("T")
              ? monitoringForm.nextMonitoringDate
              : monitoringForm.nextMonitoringDate + "T00:00:00"
            : null,
        };
        await api.put(`/monitorings/${monitoringEditId}`, payload);
      } else {
        const payload = {
          ...monitoringForm,
          monitoringDate: monitoringForm.monitoringDate.includes("T")
            ? monitoringForm.monitoringDate
            : monitoringForm.monitoringDate + "T00:00:00",
          nextMonitoringDate: monitoringForm.nextMonitoringDate
            ? monitoringForm.nextMonitoringDate.includes("T")
              ? monitoringForm.nextMonitoringDate
              : monitoringForm.nextMonitoringDate + "T00:00:00"
            : null,
        };
        await api.post("/monitorings", payload);
      }
      setIsMonitoringModalOpen(false);
      toast.success("Monitoring record saved");
      fetchProfile();
    } catch {
      toast.error("Failed to save monitoring record");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
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
        client: { id: parseInt(id) },
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
        clientId: parseInt(id),
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

      const existingSupport = data?.socialSupports?.find(
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
      const existingSupport = data?.socialSupports?.find(
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
      data?.socialSupports?.find((s: any) => s.caseId === scase.id) || {};
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
    const s = data?.socialSupports?.find(
      (support: any) => support.caseId === caseId,
    );
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

  const fetchFurtherEducations = async () => {
    try {
      const response = await api.get(`/further-educations/client/${id}`);
      setFurtherEducationForm(
        response.data || {
          university: false,
          publicSchool: false,
          vocationalTraining: false,
          computerSchool: false,
          englishSchool: false,
          chineseSchool: false,
          availableTime: "",
        },
      );
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setFurtherEducationForm({
          university: false,
          publicSchool: false,
          vocationalTraining: false,
          computerSchool: false,
          englishSchool: false,
          chineseSchool: false,
          availableTime: "",
        });
      } else {
        console.error("Failed to load further education", err);
      }
    }
  };

  const fetchFurtherEducationReferrals = async () => {
    try {
      const response = await api.get(
        `/further-education-referrals/client/${id}`,
      );
      setFurtherEducationReferrals(response.data || []);
    } catch (err) {
      console.error("Failed to load further education referrals", err);
    }
  };

  const fetchLookups = async () => {
    try {
      const [subRes, srcRes] = await Promise.all([
        api.get("/lookups/further-education-subjects"),
        api.get("/lookups/referral-sources"),
      ]);
      setReferralSubjects(subRes.data || []);
      setReferralSources(srcRes.data || []);
    } catch (err) {
      console.error("Failed to load lookups", err);
    }
  };

  const fetchFuturesTrainings = async () => {
    try {
      const response = await api.get(`/futures-trainings/client/${id}`);
      setFuturesTrainings(response.data || []);
    } catch (err) {
      console.error("Failed to load futures trainings", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data || []);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  };

  useEffect(() => {
    if (activeTab === "Further Education") {
      fetchFurtherEducations();
      fetchFurtherEducationReferrals();
      fetchLookups();
    }
    if (activeTab === "Futures Training") {
      fetchFuturesTrainings();
      fetchSubjects();
    }
  }, [activeTab]);

  const handleSaveFurtherEducation = async () => {
    try {
      await api.post("/further-educations", {
        ...furtherEducationForm,
        client: { id: parseInt(id) },
      });
      toast.success("Further Education saved!");
    } catch (err) {
      console.error("Failed to save further education", err);
      toast.error("Failed to save further education");
    }
  };

  const handleSaveFurtherEducationReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...furtherEducationReferralForm,
        client: { id: parseInt(id) },
        furtherEducationReferralSubject: {
          id: parseInt(
            furtherEducationReferralForm.furtherEducationReferralSubjectId,
          ),
        },
        educationReferralSource: {
          id: parseInt(furtherEducationReferralForm.educationReferralSourceId),
        },
      };
      await api.post("/further-education-referrals", formattedData);
      setIsFurtherEducationReferralModalOpen(false);
      fetchFurtherEducationReferrals();
      toast.success("Referral saved!");
    } catch (err) {
      console.error("Failed to save referral", err);
      toast.error("Failed to save referral");
    }
  };

  const handleSaveReferralSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSourceId) {
        await api.put(
          `/education-referral-sources/${editingSourceId}`,
          referralSourceForm,
        );
      } else {
        await api.post("/education-referral-sources", referralSourceForm);
      }
      fetchLookups();
      setReferralSourceForm({ referralSource: "", status: "Internal" });
      setEditingSourceId(null);
      toast.success("Referral source saved successfully!");
    } catch (err) {
      console.error("Failed to save referral source", err);
      toast.error("Failed to save referral source.");
    }
  };

  const handleDeleteReferralSource = async (id: number) => {
    if (confirm("Are you sure you want to delete this referral source?")) {
      try {
        await api.delete(`/education-referral-sources/${id}`);
        fetchLookups();
        toast.success("Referral source deleted.");
      } catch (err) {
        console.error("Failed to delete referral source", err);
        toast.error("Failed to delete. It might be in use.");
      }
    }
  };

  const handleSaveFuturesTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!futuresTrainingForm.subjectId) {
      toast.error("Please select a training course");
      return;
    }
    try {
      const payload = {
        id: futuresTrainingEditId || undefined,
        clientId: parseInt(id),
        subjectId: parseInt(futuresTrainingForm.subjectId),
        startDate: futuresTrainingForm.startDate.includes("T")
          ? futuresTrainingForm.startDate
          : futuresTrainingForm.startDate + "T00:00:00",
        endDate: futuresTrainingForm.endDate
          ? futuresTrainingForm.endDate.includes("T")
            ? futuresTrainingForm.endDate
            : futuresTrainingForm.endDate + "T00:00:00"
          : null,
        status: futuresTrainingForm.status,
      };
      await api.post("/futures-trainings", payload);
      setIsFuturesTrainingModalOpen(false);
      toast.success(
        futuresTrainingEditId
          ? "Training enrollment updated"
          : "Client enrolled in training course",
      );
      fetchFuturesTrainings();
    } catch (err) {
      console.error("Failed to save futures training", err);
      toast.error("Failed to save training enrollment");
    }
  };

  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectForm, setNewSubjectForm] = useState({ name: "" });

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectForm.name.trim()) {
      toast.error("Subject name is required");
      return;
    }
    try {
      const response = await api.post("/subjects", {
        name: newSubjectForm.name,
      });
      toast.success("New course added successfully");
      fetchSubjects();
      setFuturesTrainingForm((prev) => ({
        ...prev,
        subjectId: response.data.id.toString(),
      }));
      setIsAddSubjectModalOpen(false);
      setNewSubjectForm({ name: "" });
    } catch (err) {
      console.error("Failed to save subject", err);
      toast.error("Failed to add course");
    }
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
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("mtp_education_levels", JSON.stringify(updated));
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
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("mtp_education_levels", JSON.stringify(updated));

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
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("mtp_education_levels", JSON.stringify(updated));
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
        if (onClose) onClose();
        else navigate("/clients");
        return;
      } else if (itemToDelete.type === "futuresTraining") {
        if (itemToDelete.id) {
          await api.delete(`/futures-trainings/${itemToDelete.id}`);
          toast.success("Training enrollment removed");
          fetchFuturesTrainings();
        }
      } else {
        const endpoint =
          itemToDelete.type === "placement"
            ? `/placements/${itemToDelete.id}`
            : itemToDelete.type === "support"
              ? `/social-supports/${itemToDelete.id}`
              : itemToDelete.type === "jobexp"
                ? `/job-expectations/${itemToDelete.id}`
                : itemToDelete.type === "beneficiary"
                  ? `/beneficiaries/${itemToDelete.id}`
                  : itemToDelete.type === "lang"
                    ? `/languages/${itemToDelete.id}`
                    : itemToDelete.type === "skill"
                      ? `/computer-skills/${itemToDelete.id}`
                      : itemToDelete.type === "exp"
                        ? `/job-experiences/${itemToDelete.id}`
                        : itemToDelete.type === "personality"
                          ? `/personalities/${itemToDelete.id}`
                          : itemToDelete.type === "monitoring"
                            ? `/monitorings/${itemToDelete.id}`
                            : `/educations/${itemToDelete.id}`;
        await api.delete(endpoint);
        toast.success(
          `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} removed from profile`,
        );
        fetchProfile();
      }
    } catch (err) {
      toast.error(`Failed to delete ${itemToDelete.type}`);
      console.error(err);
    } finally {
      setItemToDelete(null);
    }
  };

  const clientForTabs = data?.client;

  const availableTabs = React.useMemo(() => {
    // If we are in the Registration Modal (formData exists), base tabs are just Education and Monitoring
    // If we are in the Client Profile Page (no formData), base tabs include Overview and Dependents
    const tabs = formData
      ? ["CV & Education", "Monitoring"]
      : ["Overview", "CV & Education", "Dependents", "Monitoring"];

    const furtherEducationReq = formData
      ? formData.furtherEducation
      : clientForTabs?.furtherEducation;
    const socialSupportReq = formData
      ? formData.socialSupportRequired
      : clientForTabs?.socialSupportRequired;
    const placementReq = formData
      ? formData.placement
      : clientForTabs?.placement;
    const futuresTrainingReq = formData
      ? formData.trainingFromFutures
      : clientForTabs?.trainingFromFutures;

    // Insert these logically if they are required
    if (furtherEducationReq) tabs.splice(1, 0, "Further Education");
    if (socialSupportReq)
      tabs.splice(tabs.length > 2 ? 2 : 1, 0, "Social Support");
    if (placementReq)
      tabs.splice(
        tabs.indexOf("Dependents") !== -1
          ? tabs.indexOf("Dependents")
          : tabs.length - 1,
        0,
        "Job Specification",
      );
    if (futuresTrainingReq) tabs.push("Futures Training");

    // Check for custom options
    const coreSupports = [
      "Further Education",
      "Placement",
      "Futures Training",
      "Social Support",
    ];
    const allSupportsStr = formData
      ? formData.expectedSupport
      : clientForTabs?.expectedSupport;
    const allSupports = allSupportsStr
      ? allSupportsStr
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
      : [];
    const hasCustomSupports = allSupports.some(
      (s: string) => !coreSupports.some((core) => s.includes(core)),
    );

    if (hasCustomSupports) tabs.push("Other Supports");

    return tabs;
  }, [formData, clientForTabs]);

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

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
              onClick={() => (onClose ? onClose() : navigate("/clients"))}
              className="mx-auto rounded-lg"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Client List
            </Button>
          </Alert>
        </div>
      </>
    );
  }

  const {
    client,
    cases,
    placements,
    socialSupports,
    educations,
    languages,
    computerSkills,
    personalities,
    jobExpectations,
  } = data;

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-20">
        {/* Main Content Tabs */}
        <div className="px-4 mt-8 mb-6">
          <ModernTabs
            tabs={availableTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="animate-fade-in">
          {activeTab === "Futures Training" && (
            <div className="pt-3 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">
                  Futures Courses & Trainings
                </h3>
                <Button
                  color="blue"
                  onClick={() => {
                    setFuturesTrainingForm({
                      clientId: id,
                      subjectId: "",
                      startDate:
                        new Date().toISOString().split("T")[0] + "T00:00:00",
                      endDate: "",
                      status: "Enrolled",
                    });
                    setFuturesTrainingEditId(null);
                    setIsFuturesTrainingModalOpen(true);
                  }}
                  className="rounded-lg shadow-lg shadow-blue-500/20"
                >
                  <Plus size={18} className="mr-2" /> Enroll in Course
                </Button>
              </div>

              <div className="overflow-x-auto rounded">
                <Table hoverable>
                  <TableHead className="bg-gray-50 dark:bg-gray-800 border-b">
                    <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                      ID
                    </TableHeadCell>
                    <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                      Course / Subject
                    </TableHeadCell>
                    <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                      Start Date
                    </TableHeadCell>
                    <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                      End Date
                    </TableHeadCell>
                    <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                      Status
                    </TableHeadCell>
                    <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300 text-right">
                      Action
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {futuresTrainings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-6"
                        >
                          No training records found for this client.
                        </TableCell>
                      </TableRow>
                    ) : (
                      futuresTrainings.map((t: any) => (
                        <TableRow
                          key={t.id}
                          className="bg-white dark:bg-gray-900 border-b"
                        >
                          <TableCell>{t.id}</TableCell>
                          <TableCell className="font-bold text-gray-900 dark:text-white">
                            {t.subjectName || "N/A"}
                          </TableCell>
                          <TableCell>
                            {t.startDate
                              ? format(new Date(t.startDate), "MMM dd, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {t.endDate
                              ? format(new Date(t.endDate), "MMM dd, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                t.status === "Completed"
                                  ? "success"
                                  : t.status === "Dropped"
                                    ? "failure"
                                    : "info"
                              }
                              className="w-fit"
                            >
                              {t.status || "Enrolled"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2 text-sm">
                              <button
                                onClick={() => {
                                  setFuturesTrainingForm({
                                    clientId: id,
                                    subjectId: t.subjectId
                                      ? t.subjectId.toString()
                                      : "",
                                    startDate: t.startDate ? t.startDate : "",
                                    endDate: t.endDate ? t.endDate : "",
                                    status: t.status || "Enrolled",
                                  });
                                  setFuturesTrainingEditId(t.id);
                                  setIsFuturesTrainingModalOpen(true);
                                }}
                                className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                              >
                                <Edit size={14} /> Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() =>
                                  handleDeleteItem("futuresTraining", t.id)
                                }
                                className="flex items-center gap-1 text-red-600 hover:underline font-semibold"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "Further Education" && (
            <div className="pt-3 space-y-8 animate-fade-in">
              <div className="rounded-md">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 font-semibold text-gray-700 dark:text-gray-200 border-b">
                  Education Type
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 space-y-6">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white mb-4">
                      Choose the education type:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="uni"
                          checked={furtherEducationForm.university}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFurtherEducationForm({
                              ...furtherEducationForm,
                              university: e.target.checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="uni"
                          className="text-gray-600 dark:text-gray-300 font-normal"
                        >
                          University
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="compSch"
                          checked={furtherEducationForm.computerSchool}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFurtherEducationForm({
                              ...furtherEducationForm,
                              computerSchool: e.target.checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="compSch"
                          className="text-gray-600 dark:text-gray-300 font-normal"
                        >
                          Computer School
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="pubSch"
                          checked={furtherEducationForm.publicSchool}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFurtherEducationForm({
                              ...furtherEducationForm,
                              publicSchool: e.target.checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="pubSch"
                          className="text-gray-600 dark:text-gray-300 font-normal"
                        >
                          Public School
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="engSch"
                          checked={furtherEducationForm.englishSchool}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFurtherEducationForm({
                              ...furtherEducationForm,
                              englishSchool: e.target.checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="engSch"
                          className="text-gray-600 dark:text-gray-300 font-normal"
                        >
                          English School
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="vocTrain"
                          checked={furtherEducationForm.vocationalTraining}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFurtherEducationForm({
                              ...furtherEducationForm,
                              vocationalTraining: e.target.checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="vocTrain"
                          className="text-gray-600 dark:text-gray-300 font-normal"
                        >
                          Vocational Training
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="chiSch"
                          checked={furtherEducationForm.chineseSchool}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFurtherEducationForm({
                              ...furtherEducationForm,
                              chineseSchool: e.target.checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="chiSch"
                          className="text-gray-600 dark:text-gray-300 font-normal"
                        >
                          Chinese School
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="availTime">Available Time</Label>
                    <TextInput
                      id="availTime"
                      value={furtherEducationForm.availableTime}
                      onChange={(e) =>
                        setFurtherEducationForm({
                          ...furtherEducationForm,
                          availableTime: e.target.value,
                        })
                      }
                      placeholder="e.g. Morning 8AM-12PM"
                      className="mt-1"
                    />
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button color="blue" onClick={handleSaveFurtherEducation}>
                      Save changes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Referral History Section */}
              <div className="rounded-md bg-white dark:bg-gray-900 mt-6 shadow-sm overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 font-semibold text-gray-700 dark:text-gray-200 border-b flex justify-between items-center">
                  <span>Referral History</span>
                  <div className="flex gap-2">
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => {
                        setReferralSourceForm({
                          referralSource: "",
                          status: "Internal",
                        });
                        setEditingSourceId(null);
                        setIsReferralSourceModalOpen(true);
                      }}
                      className="rounded"
                    >
                      <Plus size={14} className="mr-1" /> Add Referral Source
                    </Button>
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => {
                        setFurtherEducationReferralForm({
                          clientId: id,
                          referralDate:
                            new Date().toISOString().split("T")[0] +
                            "T00:00:00",
                          furtherEducationReferralSubjectId: "",
                          provider: "",
                          duration: "",
                          referralBy: "",
                          educationReferralSourceId: "",
                          clientType: "Normal",
                        });
                        setEditingId(null);
                        setIsFurtherEducationReferralModalOpen(true);
                      }}
                      className="rounded"
                    >
                      <Plus size={14} className="mr-1" /> Add New
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-4 items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Show</span>
                      <Select sizing="sm" className="w-20">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </Select>
                      <span>entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Search:
                      </span>
                      <TextInput
                        sizing="sm"
                        value={referralHistorySearchTerm}
                        onChange={(e) =>
                          setReferralHistorySearchTerm(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table hoverable>
                      <TableHead className="bg-gray-50 dark:bg-gray-800 border-b">
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          ID
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          Referral On
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          Referral To
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          Subject/Skill
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          Duration
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          Referral By
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                          Action
                        </TableHeadCell>
                      </TableHead>
                      <TableBody className="divide-y">
                        {furtherEducationReferrals.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center text-gray-500 py-6"
                            >
                              No data available in table
                            </TableCell>
                          </TableRow>
                        ) : (
                          furtherEducationReferrals
                            .filter(
                              (ref: any) =>
                                !referralHistorySearchTerm ||
                                Object.values(ref).some((v) =>
                                  String(v)
                                    .toLowerCase()
                                    .includes(
                                      referralHistorySearchTerm.toLowerCase(),
                                    ),
                                ),
                            )
                            .map((ref: any, idx: number) => (
                              <TableRow
                                key={idx}
                                className="bg-white dark:bg-gray-900 border-b"
                              >
                                <TableCell>{ref.id}</TableCell>
                                <TableCell>
                                  {ref.referralDate
                                    ? format(
                                      new Date(ref.referralDate),
                                      "MMM dd, yyyy",
                                    )
                                    : "N/A"}
                                </TableCell>
                                <TableCell>{ref.provider || "N/A"}</TableCell>
                                <TableCell>
                                  {ref.furtherEducationReferralSubject
                                    ?.subject || "N/A"}
                                </TableCell>
                                <TableCell>{ref.duration || "N/A"}</TableCell>
                                <TableCell>{ref.referralBy || "N/A"}</TableCell>
                                <TableCell>
                                  <div className="flex gap-3">
                                    <button
                                      title="Edit"
                                      onClick={() => {
                                        setFurtherEducationReferralForm({
                                          clientId: id,
                                          referralDate: ref.referralDate
                                            ? ref.referralDate
                                            : "",
                                          furtherEducationReferralSubjectId:
                                            ref.furtherEducationReferralSubject
                                              ?.id || "",
                                          provider: ref.provider || "",
                                          duration: ref.duration || "",
                                          referralBy: ref.referralBy || "",
                                          educationReferralSourceId:
                                            ref.educationReferralSource?.id ||
                                            "",
                                          clientType:
                                            ref.clientType || "Normal",
                                        });
                                        setEditingId(ref.id);
                                        setIsFurtherEducationReferralModalOpen(
                                          true,
                                        );
                                      }}
                                      className="text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      title="Delete"
                                      onClick={() =>
                                        handleDeleteItem(
                                          "furtherEducationReferral",
                                          ref.id,
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700 transition-colors"
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
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500">
                        Showing {furtherEducationReferrals.length > 0 ? 1 : 0}{" "}
                        to {furtherEducationReferrals.length} of{" "}
                        {furtherEducationReferrals.length} entries
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          color="dark"
                          size="sm"
                          className="rounded px-2"
                          disabled
                        >
                          Previous
                        </Button>
                        <Button
                          color="dark"
                          size="sm"
                          className="rounded px-2"
                          disabled
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-3">
              {/* Left: Quick Stats & Timeline */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <History className="text-blue-600" /> Interaction Timeline
                  </h3>
                  <div className="relative pl-8 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                    {cases.map((c: any, i: number) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white text-blue-600">
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
                      <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-white text-gray-500">
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
                </div>

                <div className="rounded-lg border-none shadow-lg dark:bg-gray-800 overflow-hidden">
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
                      <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-xs text-gray-500 uppercase dark:text-gray-400 border-b sticky top-0 z-20 backdrop-blur-md shadow-sm">
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
                              className="dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                </div>
              </div>

              {/* Right: Personal Details & Documents */}
              <div className="space-y-4">
                <div className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">
                    Vital Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Gender
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.gender}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Marital Status
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.maritalStatus || "Single"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        ID Card
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200 font-mono">
                        {client.idCard || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Nationality
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.nationality || "Khmer"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Physical
                      </span>
                      <span className="text-sm font-bold dark:text-gray-200">
                        {client.height || "-"} cm / {client.weight || "-"} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-none shadow-lg dark:bg-gray-800">
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
                            className={`p-4 rounded-lg flex flex-col items-center gap-2 group cursor-pointer transition-all ${fileUrl ?"bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 hover:border-green-400":"bg-gray-50 dark:bg-gray-700/50  hover:border-blue-400"}`}
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
                                  className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded bg-white dark:bg-gray-800 shadow-sm"
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
                                  className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded bg-white dark:bg-gray-800 shadow-sm"
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
                                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded bg-white dark:bg-gray-800 shadow-sm"
                                  title="Delete Attachment"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}

                            {/* Icon */}
                            <div
                              className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110 ${fileUrl ?"bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400":"bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
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
                              className={`text-[9px] font-bold ${fileUrl ?"text-green-600 dark:text-green-400":"text-gray-400"}`}
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
                </div>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
                  <Table
                    hoverable
                    className="border-none w-full min-w-[850px] relative"
                  >
                    <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-xs text-gray-500 uppercase dark:text-gray-400 border-b sticky top-0 z-20 backdrop-blur-md shadow-sm">
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
                              className="dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
            <div className="pt-3 space-y-8">
              {/* Section 1: Secondary & High School */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                    Secondary and High School
                  </h3>
                  <Button
                    color="indigo"
                    size="xs"
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
                    <Plus size={14} className="mr-1" /> Add Education
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {educations?.map((edu: any, i: number) => (
                    <div
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
                    </div>
                  ))}
                  {(educations?.length === 0 || !educations) && (
                    <div className="col-span-full py-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2">
                      <GraduationCap
                        size={36}
                        className="mx-auto text-gray-300 mb-2"
                      />
                      <p className="text-gray-500 text-sm font-bold">
                        Secondary & High School history is empty.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Computer Skill */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-black text-teal-600 dark:text-teal-400 uppercase tracking-tight">
                    Computer Skill
                  </h3>
                  <Button
                    color="teal"
                    size="xs"
                    onClick={() => {
                      setSkillForm({
                        clientId: id,
                        skill: "",
                        level: "Intermediate",
                        certified: "No",
                        description: "",
                      });
                      setSkillEditId(null);
                      setIsSkillModalOpen(true);
                    }}
                    className="rounded-lg shadow-lg shadow-teal-500/20"
                  >
                    <Plus size={14} className="mr-1" /> Add Computer Skill
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(computerSkills || []).map((cs: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg border-none shadow-lg dark:bg-gray-800 group relative"
                    >
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSkillForm({
                              clientId: id,
                              skill: cs.skill || "",
                              level: cs.level || "Intermediate",
                              certified: cs.certified || "No",
                              description: cs.description || "",
                            });
                            setSkillEditId(cs.id);
                            setIsSkillModalOpen(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("skill", cs.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center">
                          <Award size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 dark:text-white">
                            {cs.skill || "Unknown Skill"}
                          </h4>
                          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            {cs.level || "Intermediate"}{" "}
                            {cs.certified === "Yes" ? "• Certified" : ""}
                          </p>
                          {cs.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {cs.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(computerSkills?.length === 0 || !computerSkills) && (
                    <div className="col-span-full py-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2">
                      <Award size={36} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 text-sm font-bold">
                        Computer skills list is empty.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Languages Skill */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-black text-amber-600 dark:text-amber-500 uppercase tracking-tight">
                    Languages Skill
                  </h3>
                  <Button
                    color="amber"
                    size="xs"
                    onClick={() => {
                      setLangForm({
                        clientId: id,
                        name: "",
                        level: "Intermediate",
                      });
                      setLangEditId(null);
                      setIsLangModalOpen(true);
                    }}
                    className="rounded-lg shadow-lg shadow-amber-500/20"
                  >
                    <Plus size={14} className="mr-1" /> Add Language
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(languages || []).map((l: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg border-none shadow-lg dark:bg-gray-800 group relative"
                    >
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setLangForm({
                              clientId: id,
                              name: l.name || "",
                              level: l.level || "Intermediate",
                            });
                            setLangEditId(l.id);
                            setIsLangModalOpen(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("lang", l.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 dark:text-white">
                            {l.name || "Unknown Language"}
                          </h4>
                          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            {l.level || "Intermediate"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(languages?.length === 0 || !languages) && (
                    <div className="col-span-full py-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2">
                      <FileText
                        size={36}
                        className="mx-auto text-gray-300 mb-2"
                      />
                      <p className="text-gray-500 text-sm font-bold">
                        Languages list is empty.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Personal Profile & Hobbies */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-black text-rose-600 dark:text-rose-500 uppercase tracking-tight">
                    Personal Profile & Hobbies
                  </h3>
                  <Button
                    color="rose"
                    size="xs"
                    onClick={handleEditPersonalProfile}
                    className="rounded-lg shadow-lg shadow-rose-500/20"
                  >
                    <Edit size={14} className="mr-1" /> Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Strengths
                      </span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {(personalities && personalities[0]?.strength) ||
                          "No strengths recorded."}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Weaknesses
                      </span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {(personalities && personalities[0]?.weakness) ||
                          "No weaknesses recorded."}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border-none shadow-lg dark:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Hobbies & Interests
                      </span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {(jobExpectations && jobExpectations[0]?.hobby) ||
                          "No hobbies recorded."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Job Specification" && (
            <div className="pt-3 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">
                  Job Expectations & Specification
                </h3>
                <Button
                  color="purple"
                  onClick={() => {
                    setJobExpForm({
                      clientId: id,
                      employmentType: "Full-time",
                      salaryExpectation: "",
                      availableTime: "",
                      note: "",
                    });
                    setJobExpEditId(null);
                    setIsJobExpModalOpen(true);
                  }}
                  className="rounded-lg shadow-lg shadow-purple-500/20"
                >
                  <Plus size={18} className="mr-2" /> Add Job Expectation
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data.jobExpectations || []).map((je: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-lg border-none shadow-lg dark:bg-gray-800 group relative"
                  >
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setJobExpForm({
                            clientId: id,
                            employmentType: je.employmentType || "Full-time",
                            salaryExpectation: je.salaryExpectation || "",
                            availableTime: je.availableTime || "",
                            note: je.note || "",
                          });
                          setJobExpEditId(je.id);
                          setIsJobExpModalOpen(true);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ type: "jobexp", id: je.id });
                          setIsConfirmOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white">
                          {je.employmentType || "Unspecified Job Type"}
                        </h4>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                          {je.availableTime || "Any Time"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">
                          Expected Salary
                        </span>
                        <span className="font-black dark:text-white">
                          {je.salaryExpectation || "Negotiable"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">Notes</span>
                        <span className="font-black dark:text-white">
                          {je.note || "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(data.jobExpectations || []).length === 0 && (
                  <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2">
                    <Briefcase
                      size={48}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 font-bold">
                      No job expectations recorded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Dependents" && (
            <div className="pt-3 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">
                  Family Dependents
                </h3>
                <Button
                  color="rose"
                  onClick={() => {
                    setBeneficiaryForm({
                      clientId: id,
                      gender: "Male",
                      age: "",
                    });
                    setBeneficiaryEditId(null);
                    setIsBeneficiaryModalOpen(true);
                  }}
                  className="rounded-lg shadow-lg shadow-rose-500/20"
                >
                  <Plus size={18} className="mr-2" /> Add Dependent
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(data.beneficiaries || []).map((b: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-lg border-none shadow-lg dark:bg-gray-800 group relative text-center"
                  >
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setBeneficiaryForm({
                            clientId: id,
                            gender: b.gender || "Male",
                            age: b.age || "",
                          });
                          setBeneficiaryEditId(b.id);
                          setIsBeneficiaryModalOpen(true);
                        }}
                        className="p-1 text-blue-400 hover:text-blue-600"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ type: "beneficiary", id: b.id });
                          setIsConfirmOpen(true);
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center mx-auto mb-3">
                      <Heart size={24} />
                    </div>
                    <p className="font-black text-gray-900 dark:text-white">
                      {b.gender || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Age: {b.age || "N/A"}
                    </p>
                  </div>
                ))}
                {(data.beneficiaries || []).length === 0 && (
                  <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold">
                      No dependents recorded for this client.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Other Supports" && (
            <div className="pt-2 space-y-4 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="text-orange-500" size={24} />
                    <div>
                      <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">
                        Custom Support Needs
                      </h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Specialized requested services
                      </p>
                    </div>
                  </div>
                  <Button
                    color="blue"
                    size="sm"
                    onClick={() =>
                      setCustomFields([...customFields, { key: "", value: "" }])
                    }
                    className="shadow-sm shadow-blue-500/20 font-bold uppercase tracking-wider text-[10px]"
                  >
                    Add Field
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-4">
                      Selected Supports
                    </h4>
                    <div className="space-y-3">
                      {(() => {
                        const core = [
                          "Further Education",
                          "Placement",
                          "Futures Training",
                          "Social Support",
                        ];
                        const allStr = formData
                          ? formData.expectedSupport
                          : data?.client?.expectedSupport;
                        const all = allStr
                          ? allStr
                            .split(",")
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                          : [];
                        const custom = all.filter(
                          (s: string) => !core.some((c) => s.includes(c)),
                        );

                        if (custom.length === 0)
                          return (
                            <p className="text-sm text-gray-500">
                              No custom supports selected.
                            </p>
                          );

                        return custom.map(
                          (supportName: string, idx: number) => (
                            <div
                              key={idx}
                              className="bg-orange-50/50 dark:bg-orange-900/10 p-3 rounded-lg border-orange-100 dark:border-orange-800/20 flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <h4 className="font-bold text-orange-800 dark:text-orange-400">
                                {supportName}
                              </h4>
                            </div>
                          ),
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-4">
                      Custom Record Fields
                    </h4>
                    <div className="space-y-3">
                      {customFields.map((field, idx) => (
                        <div key={idx} className="flex gap-3">
                          <TextInput
                            placeholder="Label (e.g. Budget)"
                            className="flex-1"
                            value={field.key}
                            onChange={(e) => {
                              const newFields = [...customFields];
                              newFields[idx].key = e.target.value;
                              setCustomFields(newFields);
                            }}
                          />
                          <TextInput
                            placeholder="Value (e.g. $500)"
                            className="flex-1"
                            value={field.value}
                            onChange={(e) => {
                              const newFields = [...customFields];
                              newFields[idx].value = e.target.value;
                              setCustomFields(newFields);
                            }}
                          />
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600 p-2 transition-colors"
                            onClick={() => {
                              const newFields = [...customFields];
                              newFields.splice(idx, 1);
                              setCustomFields(newFields);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {customFields.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No custom fields added yet.
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        color="emerald"
                        size="sm"
                        onClick={handleSaveCustomFields}
                        className="shadow-sm shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]"
                      >
                        Save Custom Fields
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Monitoring" && (
            <div className="pt-2 space-y-3">
              {/* Header bar */}
              <div className="bg-gray-100 dark:bg-gray-800 p-3 font-semibold text-gray-700 dark:text-gray-200 flex flex-wrap justify-between items-center rounded">
                <span>Monitoring Information</span>
                <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                  <button
                    onClick={() => {
                      setMonitoringForm({
                        clientId: id,
                        monitoringDate:
                          new Date().toISOString().split("T")[0] + "T00:00:00",
                        nextMonitoringDate: "",
                        monitoringtype: "Monthly",
                        monitoringTime: "00:00",
                        enroll: "Enrolled",
                        type: "Placement",
                      });
                      setMonitoringEditId(null);
                      setIsMonitoringModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold border-2 border-teal-500 text-teal-600 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                  >
                    <Plus size={14} /> Placement Monitoring
                  </button>
                  <button
                    onClick={() => {
                      setMonitoringForm({
                        clientId: id,
                        monitoringDate:
                          new Date().toISOString().split("T")[0] + "T00:00:00",
                        nextMonitoringDate: "",
                        monitoringtype: "Monthly",
                        monitoringTime: "00:00",
                        enroll: "Enrolled",
                        type: "Future Training",
                      });
                      setMonitoringEditId(null);
                      setIsMonitoringModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold border-2 border-teal-500 text-teal-600 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                  >
                    <Plus size={14} /> Future training Monitoring
                  </button>
                  <button
                    onClick={() => {
                      setMonitoringForm({
                        clientId: id,
                        monitoringDate:
                          new Date().toISOString().split("T")[0] + "T00:00:00",
                        nextMonitoringDate: "",
                        monitoringtype: "Monthly",
                        monitoringTime: "00:00",
                        enroll: "Enrolled",
                        type: "Business Setup",
                      });
                      setMonitoringEditId(null);
                      setIsMonitoringModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold border-2 border-teal-500 text-teal-600 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                  >
                    <Plus size={14} /> Business setup Monitoring
                  </button>
                </div>
              </div>

              {/* DataTable controls */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Show</span>
                  <select className="rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Search:
                  </span>
                  <input
                    type="text"
                    value={monitoringSearchTerm}
                    onChange={(e) => setMonitoringSearchTerm(e.target.value)}
                    className="rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded">
                <Table hoverable>
                  <TableHead className="bg-gray-50 dark:bg-gray-800 border-b">
                    <TableHeadCell>Id</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Monitoring Date</TableHeadCell>
                    <TableHeadCell>Next Monitoring Date</TableHeadCell>
                    <TableHeadCell>Monitoring Type</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {(() => {
                      const allRows = data.monitorings || [];
                      const filtered = allRows.filter(
                        (m: any) =>
                          !monitoringSearchTerm ||
                          (m.type &&
                            m.type
                              .toLowerCase()
                              .includes(monitoringSearchTerm.toLowerCase())) ||
                          (m.monitoringtype &&
                            m.monitoringtype
                              .toLowerCase()
                              .includes(monitoringSearchTerm.toLowerCase())),
                      );
                      if (filtered.length === 0)
                        return (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-gray-500 py-6"
                            >
                              No data available in table
                            </TableCell>
                          </TableRow>
                        );
                      return filtered.map((m: any, i: number) => (
                        <TableRow
                          key={m.id ?? i}
                          className="bg-white dark:bg-gray-900"
                        >
                          <TableCell className="font-semibold">
                            {m.id}
                          </TableCell>
                          <TableCell>{m.type || "-"}</TableCell>
                          <TableCell>
                            {m.monitoringDate
                              ? format(
                                new Date(m.monitoringDate),
                                "MMM dd, yyyy",
                              )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {m.nextMonitoringDate
                              ? format(
                                new Date(m.nextMonitoringDate),
                                "MMM dd, yyyy",
                              )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge color="teal">
                              {m.monitoringtype || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2 text-sm">
                              <button
                                onClick={() => {
                                  setMonitoringForm({
                                    clientId: id,
                                    monitoringDate: m.monitoringDate || "",
                                    nextMonitoringDate:
                                      m.nextMonitoringDate || "",
                                    monitoringtype:
                                      m.monitoringtype || "Monthly",
                                    monitoringTime: m.monitoringTime || "00:00",
                                    enroll: m.enroll || "Enrolled",
                                    type: m.type || "General",
                                  });
                                  setMonitoringEditId(m.id);
                                  setIsMonitoringModalOpen(true);
                                }}
                                className="flex items-center gap-1 text-teal-600 hover:underline font-semibold"
                              >
                                <Edit size={14} /> Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => {
                                  setItemToDelete({
                                    type: "monitoring",
                                    id: m.id,
                                  });
                                  setIsConfirmOpen(true);
                                }}
                                className="flex items-center gap-1 text-teal-600 hover:underline font-semibold"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-teal-600 font-medium">
                  Showing {(data.monitorings || []).length > 0 ? 1 : 0} to{" "}
                  {(data.monitorings || []).length} of{" "}
                  {(data.monitorings || []).length} entries
                </span>
                <div className="flex gap-1">
                  <button
                    className="px-4 py-1.5 text-sm font-semibold bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="px-4 py-1.5 text-sm font-semibold bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                    disabled
                  >
                    Next
                  </button>
                </div>
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
          <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold dark:text-white">
              {isEditMode ? "Update Placement" : "Record New Placement"}
            </h3>
            <button
              type="button"
              onClick={() => setIsPlacementModalOpen(false)}
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
                    onChange={(date: any) =>
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
              className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
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
      </div>
      {/* Job Expectation Modal */}
      <Modal
        show={isJobExpModalOpen}
        onClose={() => setIsJobExpModalOpen(false)}
        size="md"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {jobExpEditId ? "Update Job Expectation" : "Add Job Expectation"}
          </h3>
          <button
            type="button"
            onClick={() => setIsJobExpModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSaveJobExp} className="space-y-4">
            <div>
              <Label className="mb-1 block">Employment Type</Label>
              <Select
                value={jobExpForm.employmentType}
                onChange={(e) =>
                  setJobExpForm({
                    ...jobExpForm,
                    employmentType: e.target.value,
                  })
                }
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Seasonal</option>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Expected Salary</Label>
              <TextInput
                value={jobExpForm.salaryExpectation}
                onChange={(e) =>
                  setJobExpForm({
                    ...jobExpForm,
                    salaryExpectation: e.target.value,
                  })
                }
                placeholder="e.g. $250/month"
              />
            </div>
            <div>
              <Label className="mb-1 block">Available Time</Label>
              <TextInput
                value={jobExpForm.availableTime}
                onChange={(e) =>
                  setJobExpForm({
                    ...jobExpForm,
                    availableTime: e.target.value,
                  })
                }
                placeholder="e.g. Immediate"
              />
            </div>
            <div>
              <Label className="mb-1 block">Notes</Label>
              <TextInput
                value={jobExpForm.note}
                onChange={(e) =>
                  setJobExpForm({ ...jobExpForm, note: e.target.value })
                }
                placeholder="Any specific requirements"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsJobExpModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="blue"
            size="sm"
            onClick={handleSaveJobExp}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {jobExpEditId ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Beneficiary (Dependent) Modal */}
      <Modal
        show={isBeneficiaryModalOpen}
        onClose={() => setIsBeneficiaryModalOpen(false)}
        size="sm"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {beneficiaryEditId ? "Update Dependent" : "Add Dependent"}
          </h3>
          <button
            type="button"
            onClick={() => setIsBeneficiaryModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSaveBeneficiary} className="space-y-4">
            <div>
              <Label className="mb-1 block">Gender</Label>
              <Select
                value={beneficiaryForm.gender}
                onChange={(e) =>
                  setBeneficiaryForm({
                    ...beneficiaryForm,
                    gender: e.target.value,
                  })
                }
              >
                <option>Male</option>
                <option>Female</option>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Age</Label>
              <TextInput
                type="number"
                min="0"
                max="100"
                value={beneficiaryForm.age}
                onChange={(e) =>
                  setBeneficiaryForm({
                    ...beneficiaryForm,
                    age: e.target.value,
                  })
                }
                placeholder="e.g. 5"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsBeneficiaryModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="rose"
            size="sm"
            onClick={handleSaveBeneficiary}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {beneficiaryEditId ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Language Modal */}
      <Modal
        show={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        size="sm"
      >
        <ModalHeader>Language</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSaveLang} className="space-y-4">
            <div>
              <Label>Name</Label>
              <TextInput
                required
                value={langForm.name}
                onChange={(e) =>
                  setLangForm({ ...langForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Level</Label>
              <Select
                value={langForm.level}
                onChange={(e) =>
                  setLangForm({ ...langForm, level: e.target.value })
                }
              >
                <option>Basic</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Native</option>
              </Select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="teal" onClick={handleSaveLang}>
            Save
          </Button>
          <Button color="gray" onClick={() => setIsLangModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Skill Modal */}
      <Modal
        show={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        size="md"
      >
        <ModalHeader>Computer Skill</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSaveSkill} className="space-y-4">
            <div>
              <Label>Skill</Label>
              <TextInput
                required
                value={skillForm.skill}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, skill: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Level</Label>
              <Select
                value={skillForm.level}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, level: e.target.value })
                }
              >
                <option>Basic</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </Select>
            </div>
            <div>
              <Label>Certified</Label>
              <Select
                value={skillForm.certified}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, certified: e.target.value })
                }
              >
                <option>Yes</option>
                <option>No</option>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <TextInput
                value={skillForm.description}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, description: e.target.value })
                }
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="teal" onClick={handleSaveSkill}>
            Save
          </Button>
          <Button color="gray" onClick={() => setIsSkillModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Job Experience Modal */}
      <Modal
        show={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        size="md"
      >
        <ModalHeader>Job Experience</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSaveExp} className="space-y-4">
            <div>
              <Label>Employer</Label>
              <TextInput
                required
                value={expForm.employer}
                onChange={(e) =>
                  setExpForm({ ...expForm, employer: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Duration</Label>
              <TextInput
                required
                value={expForm.duration}
                onChange={(e) =>
                  setExpForm({ ...expForm, duration: e.target.value })
                }
                placeholder="e.g. 2020 - 2022"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={expForm.description}
                onChange={(e) =>
                  setExpForm({ ...expForm, description: e.target.value })
                }
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={handleSaveExp}>
            Save
          </Button>
          <Button color="gray" onClick={() => setIsExpModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Personality Modal */}
      <Modal
        show={isPersonalityModalOpen}
        onClose={() => setIsPersonalityModalOpen(false)}
        size="md"
      >
        <ModalHeader>Personality Profile</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSavePersonality} className="space-y-4">
            <div>
              <Label>Strengths</Label>
              <Textarea
                rows={4}
                value={personalityForm.strength}
                onChange={(e) =>
                  setPersonalityForm({
                    ...personalityForm,
                    strength: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Weaknesses</Label>
              <Textarea
                rows={4}
                value={personalityForm.weakness}
                onChange={(e) =>
                  setPersonalityForm({
                    ...personalityForm,
                    weakness: e.target.value,
                  })
                }
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="green" onClick={handleSavePersonality}>
            Save
          </Button>
          <Button color="gray" onClick={() => setIsPersonalityModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Monitoring Modal */}
      <Modal
        show={isMonitoringModalOpen}
        onClose={() => setIsMonitoringModalOpen(false)}
        size="md"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {monitoringEditId ? "Update Monitoring" : "Add Monitoring Record"}
          </h3>
          <button
            type="button"
            onClick={() => setIsMonitoringModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSaveMonitoring} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Monitoring Date</Label>
                <Datepicker
                  required
                  type="datetime-local"
                  value={monitoringForm.monitoringDate.substring(0, 16)}
                  onChange={(e: any) =>
                    setMonitoringForm({
                      ...monitoringForm,
                      monitoringDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Monitoring Time</Label>
                <TextInput
                  required
                  type="time"
                  value={monitoringForm.monitoringTime}
                  onChange={(e) =>
                    setMonitoringForm({
                      ...monitoringForm,
                      monitoringTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Next Monitoring Date</Label>
                <Datepicker
                  type="datetime-local"
                  value={
                    monitoringForm.nextMonitoringDate
                      ? monitoringForm.nextMonitoringDate.substring(0, 16)
                      : ""
                  }
                  onChange={(e: any) =>
                    setMonitoringForm({
                      ...monitoringForm,
                      nextMonitoringDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Monitoring Type</Label>
                <Select
                  value={monitoringForm.monitoringtype}
                  onChange={(e) =>
                    setMonitoringForm({
                      ...monitoringForm,
                      monitoringtype: e.target.value,
                    })
                  }
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                  <option>Follow-up</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Enroll</Label>
                <Select
                  value={monitoringForm.enroll}
                  onChange={(e) =>
                    setMonitoringForm({
                      ...monitoringForm,
                      enroll: e.target.value,
                    })
                  }
                >
                  <option>Enrolled</option>
                  <option>Not Enrolled</option>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">Type</Label>
                <TextInput
                  required
                  value={monitoringForm.type}
                  onChange={(e) =>
                    setMonitoringForm({
                      ...monitoringForm,
                      type: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsMonitoringModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="teal"
            size="sm"
            onClick={handleSaveMonitoring}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {monitoringEditId ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Further Education Referral Modal */}
      <Modal
        show={isFurtherEducationReferralModalOpen}
        onClose={() => setIsFurtherEducationReferralModalOpen(false)}
        size="lg"
        popup
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {editingId ? "Edit Referral" : "Add New Referral"}
          </h3>
          <button
            type="button"
            onClick={() => setIsFurtherEducationReferralModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form
            id="furtherEducationReferralForm"
            onSubmit={handleSaveFurtherEducationReferral}
            className="space-y-4"
          >
            <div>
              <Label className="mb-1 block">
                Referral On <span className="text-red-500">*</span>
              </Label>
              <Datepicker
                type="datetime-local"
                value={furtherEducationReferralForm.referralDate.substring(
                  0,
                  16,
                )}
                onChange={(e: any) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    referralDate: e.target.value + ":00",
                  })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-1 block">Referral To (Provider)</Label>
              <TextInput
                value={furtherEducationReferralForm.provider}
                onChange={(e) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    provider: e.target.value,
                  })
                }
                placeholder="Enter provider"
              />
            </div>
            <div>
              <Label className="mb-1 block">
                Subject/Skill <span className="text-red-500">*</span>
              </Label>
              <Select
                value={
                  furtherEducationReferralForm.furtherEducationReferralSubjectId
                }
                onChange={(e) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    furtherEducationReferralSubjectId: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Subject/Skill --</option>
                {referralSubjects.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subject}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Duration</Label>
              <TextInput
                value={furtherEducationReferralForm.duration}
                onChange={(e) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    duration: e.target.value,
                  })
                }
                placeholder="e.g. 6 months"
              />
            </div>
            <div>
              <Label className="mb-1 block">Referral By</Label>
              <TextInput
                value={furtherEducationReferralForm.referralBy}
                onChange={(e) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    referralBy: e.target.value,
                  })
                }
                placeholder="Who referred?"
              />
            </div>
            <div>
              <Label className="mb-1 block">
                Referral Source <span className="text-red-500">*</span>
              </Label>
              <Select
                value={furtherEducationReferralForm.educationReferralSourceId}
                onChange={(e) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    educationReferralSourceId: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Source --</option>
                {referralSources.map((src: any) => (
                  <option key={src.id} value={src.id}>
                    {src.referralSource}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Client Type</Label>
              <TextInput
                value={furtherEducationReferralForm.clientType}
                onChange={(e) =>
                  setFurtherEducationReferralForm({
                    ...furtherEducationReferralForm,
                    clientType: e.target.value,
                  })
                }
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsFurtherEducationReferralModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="teal"
            size="sm"
            type="submit"
            form="furtherEducationReferralForm"
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {editingId ? "Update" : "Save changes"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Referral Source Modal */}
      <Modal
        show={isReferralSourceModalOpen}
        onClose={() => setIsReferralSourceModalOpen(false)}
        size="4xl"
        popup
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">Referral Source</h3>
          <button
            type="button"
            onClick={() => setIsReferralSourceModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block font-semibold">
                  Referral Source
                </Label>
                <TextInput
                  value={referralSourceForm.referralSource}
                  onChange={(e) =>
                    setReferralSourceForm({
                      ...referralSourceForm,
                      referralSource: e.target.value,
                    })
                  }
                  placeholder="Enter referral source"
                />
              </div>
              <div>
                <Label className="mb-1 block font-semibold">Origin</Label>
                <Select
                  value={referralSourceForm.status}
                  onChange={(e) =>
                    setReferralSourceForm({
                      ...referralSourceForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                color="blue"
                onClick={handleSaveReferralSource}
                size="sm"
                className="rounded font-bold"
              >
                {editingSourceId ? "Update" : "Add New"}
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Show</span>
                <Select sizing="sm" className="w-20">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </Select>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Search:
                </span>
                <TextInput
                  sizing="sm"
                  value={referralSourceSearchTerm}
                  onChange={(e) => setReferralSourceSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead className="bg-gray-50 dark:bg-gray-800 border-b">
                  <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                    ID
                  </TableHeadCell>
                  <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                    Referral Source
                  </TableHeadCell>
                  <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
                    Origin
                  </TableHeadCell>
                  <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300 text-right">
                    Action
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {referralSources
                    .filter(
                      (src: any) =>
                        !referralSourceSearchTerm ||
                        (src.referralSource &&
                          src.referralSource
                            .toLowerCase()
                            .includes(
                              referralSourceSearchTerm.toLowerCase(),
                            )) ||
                        (src.status &&
                          src.status
                            .toLowerCase()
                            .includes(referralSourceSearchTerm.toLowerCase())),
                    )
                    .map((src: any, idx: number) => (
                      <TableRow
                        key={idx}
                        className="bg-white dark:bg-gray-900 border-b"
                      >
                        <TableCell>{src.id}</TableCell>
                        <TableCell>{src.referralSource}</TableCell>
                        <TableCell>{src.status}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 text-sm">
                            <button
                              onClick={() => {
                                setEditingSourceId(src.id);
                                setReferralSourceForm({
                                  referralSource: src.referralSource || "",
                                  status: src.status || "Internal",
                                });
                              }}
                              className="text-teal-600 hover:underline flex items-center font-semibold"
                            >
                              <Edit size={14} className="mr-1" /> Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDeleteReferralSource(src.id)}
                              className="text-teal-600 hover:underline flex items-center font-semibold"
                            >
                              <Trash2 size={14} className="mr-1" /> Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {referralSources.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-6"
                      >
                        No data available in table
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Showing {referralSources.length > 0 ? 1 : 0} to{" "}
                {referralSources.length} of {referralSources.length} entries
              </span>
              <div className="flex items-center gap-1">
                <Button
                  color="dark"
                  size="sm"
                  className="rounded px-2"
                  disabled
                >
                  Previous
                </Button>
                <div className="bg-teal-600 text-white px-3 py-1 text-sm rounded font-bold">
                  1
                </div>
                <Button
                  color="dark"
                  size="sm"
                  className="rounded px-2"
                  disabled
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-between !p-4">
          <div></div>
          <div className="flex gap-3">
            <Button
              color="gray"
              size="sm"
              onClick={() => setIsReferralSourceModalOpen(false)}
              className="rounded-md font-bold text-gray-600"
            >
              Close
            </Button>
            <Button
              color="dark"
              size="sm"
              onClick={() => {
                setReferralSourceForm({
                  referralSource: "",
                  status: "Internal",
                });
                setEditingSourceId(null);
              }}
              className="rounded-md font-bold bg-gray-800 text-white"
            >
              Add New
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Futures Training Modal */}
      <Modal
        show={isFuturesTrainingModalOpen}
        onClose={() => setIsFuturesTrainingModalOpen(false)}
        size="md"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {futuresTrainingEditId
              ? "Update Training Enrollment"
              : "Enroll in Training Course"}
          </h3>
          <button
            type="button"
            onClick={() => setIsFuturesTrainingModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSaveFuturesTraining} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="font-semibold">
                  Course / Subject <span className="text-red-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setNewSubjectForm({ name: "" });
                    setIsAddSubjectModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:underline flex items-center font-bold"
                >
                  <Plus size={12} className="mr-0.5" /> Create Course
                </button>
              </div>
              <Select
                value={futuresTrainingForm.subjectId}
                onChange={(e) =>
                  setFuturesTrainingForm({
                    ...futuresTrainingForm,
                    subjectId: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Course --</option>
                {subjects.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="mb-1 block font-semibold">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={
                  futuresTrainingForm.startDate
                    ? new Date(futuresTrainingForm.startDate)
                    : null
                }
                onChange={(date) =>
                  setFuturesTrainingForm({
                    ...futuresTrainingForm,
                    startDate: format(date, "yyyy-MM-dd") + "T00:00:00",
                  })
                }
              />
            </div>
            <div>
              <Label className="mb-1 block font-semibold">End Date</Label>
              <DatePicker
                value={
                  futuresTrainingForm.endDate
                    ? new Date(futuresTrainingForm.endDate)
                    : null
                }
                onChange={(date) =>
                  setFuturesTrainingForm({
                    ...futuresTrainingForm,
                    endDate: date
                      ? format(date, "yyyy-MM-dd") + "T00:00:00"
                      : "",
                  })
                }
                placeholder="Select end date..."
              />
            </div>
            <div>
              <Label className="mb-1 block font-semibold">Status</Label>
              <Select
                value={futuresTrainingForm.status}
                onChange={(e) =>
                  setFuturesTrainingForm({
                    ...futuresTrainingForm,
                    status: e.target.value,
                  })
                }
                required
              >
                <option value="Enrolled">Enrolled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
                <option value="Failed">Failed</option>
              </Select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsFuturesTrainingModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="blue"
            size="sm"
            onClick={handleSaveFuturesTraining}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {futuresTrainingEditId ? "Update" : "Enroll"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Subject / Course Modal */}
      <Modal
        show={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        size="sm"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            Create Training Course
          </h3>
          <button
            type="button"
            onClick={() => setIsAddSubjectModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSaveSubject} className="space-y-4">
            <div>
              <Label className="mb-1 block font-semibold">
                Course / Subject Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                value={newSubjectForm.name}
                onChange={(e) => setNewSubjectForm({ name: e.target.value })}
                placeholder="e.g. English Communication"
                required
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsAddSubjectModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="blue"
            size="sm"
            onClick={handleSaveSubject}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            Create
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Personal Profile Modal */}
      <Modal
        show={isPersonalProfileModalOpen}
        onClose={() => setIsPersonalProfileModalOpen(false)}
        size="md"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            Edit Personal Profile & Hobbies
          </h3>
          <button
            type="button"
            onClick={() => setIsPersonalProfileModalOpen(false)}
            className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSavePersonalProfile} className="space-y-4">
            <div>
              <Label className="mb-1 block font-semibold font-bold">
                Strengths
              </Label>
              <Textarea
                rows={3}
                value={personalProfileForm.strength}
                onChange={(e) =>
                  setPersonalProfileForm({
                    ...personalProfileForm,
                    strength: e.target.value,
                  })
                }
                placeholder="List client strengths..."
              />
            </div>
            <div>
              <Label className="mb-1 block font-semibold font-bold">
                Weaknesses
              </Label>
              <Textarea
                rows={3}
                value={personalProfileForm.weakness}
                onChange={(e) =>
                  setPersonalProfileForm({
                    ...personalProfileForm,
                    weakness: e.target.value,
                  })
                }
                placeholder="List client weaknesses..."
              />
            </div>
            <div>
              <Label className="mb-1 block font-semibold font-bold">
                Hobbies & Interests
              </Label>
              <TextInput
                value={personalProfileForm.hobby}
                onChange={(e) =>
                  setPersonalProfileForm({
                    ...personalProfileForm,
                    hobby: e.target.value,
                  })
                }
                placeholder="e.g. Reading, Football, Chess"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsPersonalProfileModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="blue"
            size="sm"
            onClick={handleSavePersonalProfile}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
