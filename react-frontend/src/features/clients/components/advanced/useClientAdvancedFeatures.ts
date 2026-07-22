import { useState, useEffect } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

interface UseClientAdvancedFeaturesProps {
  clientId: string | number;
}

export const useClientAdvancedFeatures = ({ clientId }: UseClientAdvancedFeaturesProps) => {
  const id = clientId.toString();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Futures Training");

  // Tab Data States
  const [futuresTrainings, setFuturesTrainings] = useState<any[]>([]);
  const [furtherEducationReferrals, setFurtherEducationReferrals] = useState<any[]>([]);
  const [jobExpectations, setJobExpectations] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [computerSkills, setComputerSkills] = useState<any[]>([]);
  const [jobExperiences, setJobExperiences] = useState<any[]>([]);
  const [personalities, setPersonalities] = useState<any[]>([]);
  const [monitorings, setMonitorings] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [legalCases, setLegalCases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Modals state
  const [isFuturesTrainingModalOpen, setIsFuturesTrainingModalOpen] = useState(false);
  const [isFurtherEducationReferralModalOpen, setIsFurtherEducationReferralModalOpen] = useState(false);
  const [isReferralSourceModalOpen, setIsReferralSourceModalOpen] = useState(false);
  const [isJobExpModalOpen, setIsJobExpModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false);
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);

  // Forms state
  const [furtherEducationForm, setFurtherEducationForm] = useState({
    university: false,
    vocational: false,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/clients/${id}`);
      setData(res.data);
      if (res.data) {
        setJobExpectations(res.data.jobExpectations || []);
        setLanguages(res.data.languages || []);
        setComputerSkills(res.data.computerSkills || []);
        setJobExperiences(res.data.jobExperiences || []);
        setPersonalities(res.data.personalities || []);
        setMonitorings(res.data.postPlacementMonitorings || []);
        setMedicalRecords(res.data.healthRecords || []);
        setLegalCases(res.data.legalCases || []);
        setDocuments(res.data.documents || []);
      }
    } catch (e) {
      toast.error("Failed to load client advanced profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFuturesTrainings = async () => {
    try {
      const res = await api.get(`/futures-trainings/client/${id}`);
      setFuturesTrainings(res.data || []);
    } catch (e) {
      // fallback
    }
  };

  const fetchFurtherEducationReferrals = async () => {
    try {
      const res = await api.get(`/further-education-referrals/client/${id}`);
      setFurtherEducationReferrals(res.data || []);
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (activeTab === "Futures Training") fetchFuturesTrainings();
    if (activeTab === "Further Education") fetchFurtherEducationReferrals();
  }, [activeTab, id]);

  const handleDeleteItem = async (type: string, itemId: number) => {
    try {
      await api.delete(`/${type}s/${itemId}`);
      toast.success("Item deleted successfully");
      fetchProfile();
      if (activeTab === "Futures Training") fetchFuturesTrainings();
      if (activeTab === "Further Education") fetchFurtherEducationReferrals();
    } catch (e) {
      toast.error("Failed to delete item");
    }
  };

  const handleSaveFurtherEducation = async () => {
    try {
      await api.post("/further-educations", {
        ...furtherEducationForm,
        client: { id: parseInt(id) },
      });
      toast.success("Further education settings saved");
    } catch (e) {
      toast.error("Failed to save education settings");
    }
  };

  return {
    id,
    data,
    loading,
    activeTab,
    setActiveTab,
    futuresTrainings,
    furtherEducationReferrals,
    jobExpectations,
    languages,
    computerSkills,
    jobExperiences,
    personalities,
    monitorings,
    medicalRecords,
    legalCases,
    documents,
    furtherEducationForm,
    setFurtherEducationForm,
    // Modals
    isFuturesTrainingModalOpen,
    setIsFuturesTrainingModalOpen,
    isFurtherEducationReferralModalOpen,
    setIsFurtherEducationReferralModalOpen,
    isReferralSourceModalOpen,
    setIsReferralSourceModalOpen,
    isJobExpModalOpen,
    setIsJobExpModalOpen,
    isLangModalOpen,
    setIsLangModalOpen,
    isSkillModalOpen,
    setIsSkillModalOpen,
    isExpModalOpen,
    setIsExpModalOpen,
    isPersonalityModalOpen,
    setIsPersonalityModalOpen,
    isMonitoringModalOpen,
    setIsMonitoringModalOpen,
    isMedicalModalOpen,
    setIsMedicalModalOpen,
    isLegalModalOpen,
    setIsLegalModalOpen,
    isUploadDocModalOpen,
    setIsUploadDocModalOpen,
    // Handlers
    handleDeleteItem,
    handleSaveFurtherEducation,
  };
};

export default useClientAdvancedFeatures;
