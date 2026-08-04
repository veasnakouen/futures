import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export function useClientSupportCases(
  clientId: string | string[] | undefined,
  fetchProfile: () => void,
  socialSupports: any[] = []
) {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isManageCasesOpen, setIsManageCasesOpen] = useState(false);
  const [caseForm, setCaseForm] = useState({
    subject: "",
    description: "",
    priority: "Normal",
    serviceType: "Social Support",
  });
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [isCaseEditMode, setIsCaseEditMode] = useState(false);

  const [supportForm, setSupportForm] = useState({
    clientId,
    caseId: clientId,
    healthProblem: false,
    healthProblemDetail: "",
    drugProblem: false,
    drugProblemDetail: "",
    description: "",
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

  const [isSocialSupportCaseModalOpen, setIsSocialSupportCaseModalOpen] = useState(false);
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
    } catch {
      toast.error("Failed to save Case Worker");
    }
  };

  const handleDeleteWorker = async (workerId: number) => {
    if (!window.confirm("Are you sure you want to delete this Case Worker?")) return;
    try {
      await api.delete(`/case-workers/${workerId}`);
      toast.success("Case Worker deleted successfully");
      fetchProfile();
    } catch {
      toast.error("Failed to delete Case Worker");
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
        client: { id: parseInt(Array.isArray(clientId) ? clientId[0] : clientId || "0") },
        status: ssCaseForm.status,
      };

      let savedCase: any;
      if (editingSsCaseId) {
        const res = await api.put(`/social-support-cases/${editingSsCaseId}`, casePayload);
        savedCase = res.data;
        toast.success("Social Support Case updated successfully");
      } else {
        const res = await api.post("/social-support-cases", casePayload);
        savedCase = res.data;
        toast.success("Social Support Case added successfully");
      }

      const caseId = savedCase.id;

      const supportPayload = {
        clientId: parseInt(Array.isArray(clientId) ? clientId[0] : clientId || "0"),
        caseId: caseId,
        healthProblem: ssCaseForm.healthProblem,
        healthProblemDetail: ssCaseForm.healthProblem ? ssCaseForm.healthProblemDetail : "",
        drugProblem: ssCaseForm.drugProblem,
        drugProblemDetail: ssCaseForm.drugProblem ? ssCaseForm.drugProblemDetail : "",
        babyProblem: ssCaseForm.babyProblem,
        babyProblemDetail: ssCaseForm.babyProblem ? ssCaseForm.babyProblemDetail : "",
        personalProblem: ssCaseForm.personalProblem,
        personalProblemDetail: ssCaseForm.personalProblem ? ssCaseForm.personalProblemDetail : "",
        legalProblem: ssCaseForm.legalProblem,
        legalProblemDetail: ssCaseForm.legalProblem ? ssCaseForm.legalProblemDetail : "",
        otherProblem: ssCaseForm.otherProblem,
        otherProblemDetail: ssCaseForm.otherProblem ? ssCaseForm.otherProblemDetail : "",
        description: ssCaseForm.description,
      };

      const existingSupport = socialSupports.find((s: any) => s.caseId === caseId);
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
    } catch {
      toast.error("Failed to save Social Support Case");
    }
  };

  const handleDeleteSsCase = async (caseId: number) => {
    if (!window.confirm("Are you sure you want to delete this Social Support Case and all its details?")) return;
    try {
      const existingSupport = socialSupports.find((s: any) => s.caseId === caseId);
      if (existingSupport) {
        await api.delete(`/social-supports/${existingSupport.id}`);
      }
      await api.delete(`/social-support-cases/${caseId}`);
      toast.success("Social Support Case deleted successfully");
      fetchProfile();
    } catch {
      toast.error("Failed to delete Social Support Case");
    }
  };

  const handleEditSsCase = (scase: any) => {
    const associatedSupport = socialSupports.find((s: any) => s.caseId === scase.id) || {};
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

  const handleAddSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.caseId) {
      toast.error("Please associate this entry with a valid case first.");
      return;
    }
    try {
      await api.post("/social-supports", supportForm);
      setIsSupportModalOpen(false);
      toast.success("Support entry saved successfully");
      fetchProfile();
    } catch (err: any) {
      toast.error(`Failed to save support: ${err.response?.data?.message || err.message}`);
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
        clientId,
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
    } catch {
      toast.error("Failed to save case");
    }
  };

  return {
    isSupportModalOpen,
    setIsSupportModalOpen,
    isManageCasesOpen,
    setIsManageCasesOpen,
    caseForm,
    setCaseForm,
    editingCaseId,
    setEditingCaseId,
    isCaseEditMode,
    setIsCaseEditMode,
    supportForm,
    setSupportForm,
    caseWorkers,
    setCaseWorkers,
    socialSupportCases,
    setSocialSupportCases,
    isCaseWorkerModalOpen,
    setIsCaseWorkerModalOpen,
    workerForm,
    setWorkerForm,
    editingWorkerId,
    setEditingWorkerId,
    isSocialSupportCaseModalOpen,
    setIsSocialSupportCaseModalOpen,
    editingSsCaseId,
    setEditingSsCaseId,
    ssCaseForm,
    setSsCaseForm,
    handleSaveWorker,
    handleDeleteWorker,
    handleSaveSsCase,
    handleDeleteSsCase,
    handleEditSsCase,
    getProblemsList,
    handleAddSupport,
    handleAddCase,
  };
}
