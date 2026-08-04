import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { safeStorage } from "@/utils/safeStorage";

export function useClientEducation(clientId: string | string[] | undefined, fetchProfile: () => void) {
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  const [educationLevels, setEducationLevels] = useState<string[]>(() => {
    const saved = safeStorage.getItem("mtp_education_levels");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return ["Primary School", "High School", "Vocational", "University"];
  });

  const [isManageLevelsOpen, setIsManageLevelsOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
  const [editingLevelIndex, setEditingLevelIndex] = useState<number | null>(null);
  const [editingLevelValue, setEditingLevelValue] = useState("");

  const [educationForm, setEducationForm] = useState({
    clientId,
    schoolName: "",
    currentLevel: educationLevels[0] || "High School",
    status: "Completed",
  });

  const handleAddEducation = async (e: React.FormEvent, isEditMode: boolean, editingId: number | null) => {
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
    } catch {
      toast.error("Failed to save education");
    }
  };

  const handleAddLevel = () => {
    const trimmed = newLevelName.trim();
    if (!trimmed) {
      toast.error("Level name cannot be empty");
      return;
    }
    if (educationLevels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Level already exists");
      return;
    }
    const updated = [...educationLevels, trimmed];
    setEducationLevels(updated);
    safeStorage.setItem("mtp_education_levels", JSON.stringify(updated));
    setNewLevelName("");
    toast.success(`Level "${trimmed}" added`);
  };

  const handleDeleteLevel = (levelToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete the level "${levelToDelete}"?`)) return;
    const updated = educationLevels.filter((l) => l !== levelToDelete);
    setEducationLevels(updated);
    safeStorage.setItem("mtp_education_levels", JSON.stringify(updated));

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
    if (educationLevels.some((l, idx) => idx !== index && l.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Level already exists");
      return;
    }
    const updated = [...educationLevels];
    updated[index] = trimmed;
    setEducationLevels(updated);
    safeStorage.setItem("mtp_education_levels", JSON.stringify(updated));
    setEditingLevelIndex(null);

    if (educationForm.currentLevel === oldName) {
      setEducationForm((prev) => ({ ...prev, currentLevel: trimmed }));
    }
    toast.success("Level renamed successfully");
  };

  return {
    isEducationModalOpen,
    setIsEducationModalOpen,
    educationLevels,
    setEducationLevels,
    isManageLevelsOpen,
    setIsManageLevelsOpen,
    newLevelName,
    setNewLevelName,
    editingLevelIndex,
    setEditingLevelIndex,
    editingLevelValue,
    setEditingLevelValue,
    educationForm,
    setEducationForm,
    handleAddEducation,
    handleAddLevel,
    handleDeleteLevel,
    handleEditLevel,
  };
}
