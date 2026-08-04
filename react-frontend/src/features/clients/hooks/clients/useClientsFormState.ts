import { useState } from "react";
import type { Client } from "./useClientsDataQuery";

export function useClientsFormState() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clientCode: "",
    branch: "Phnom Penh",
    gender: "Male",
    status: "Active",
    email: "",
    contactPhone: "",
    photo: "",
    dateOfBirth: "",
    relativePhone: "",
    maritalStatus: "Single",
    address: "",
    province: "Phnom Penh",
    idCard: "",
    currentSituation: "",
    furtherEducation: false,
    placement: false,
    trainingFromFutures: false,
    socialSupportRequired: false,
    hearBy: "",
    expectedSupport: "",
    placeOfBirth: "",
    nationality: "Cambodian",
    citizenship: "Cambodian",
    height: "",
    weight: "",
    socialSupportProblem: "",
    idpoorStatus: "No",
    idpoorValiddate: "",
    idpoorLevel: "",
    idpoorAccountNumber: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (client: Client) => {
    let safeDob = "";
    if (client.dateOfBirth) {
      try {
        safeDob = new Date(client.dateOfBirth).toISOString().split("T")[0];
      } catch {
        safeDob = "";
      }
    }
    let safeIdPoor = "";
    if (client.idpoorValiddate) {
      try {
        safeIdPoor = new Date(client.idpoorValiddate).toISOString().split("T")[0];
      } catch {
        safeIdPoor = "";
      }
    }

    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      clientCode: client.clientCode,
      branch: client.branch,
      gender: client.gender,
      status: client.status,
      email: client.email || "",
      contactPhone: client.contactPhone || "",
      photo: client.photo || "",
      dateOfBirth: safeDob,
      relativePhone: client.relativePhone || "",
      maritalStatus: client.maritalStatus || "Single",
      address: client.address || "",
      province: client.province || "Phnom Penh",
      idCard: client.idCard || "",
      currentSituation: client.currentSituation || "",
      furtherEducation: client.furtherEducation || false,
      placement: client.placement || false,
      trainingFromFutures: client.trainingFromFutures || false,
      socialSupportRequired: client.socialSupportRequired || false,
      hearBy: client.hearBy || "",
      expectedSupport: client.expectedSupport || "",
      placeOfBirth: client.placeOfBirth || "",
      nationality: client.nationality || "Cambodian",
      citizenship: client.citizenship || "Cambodian",
      height: client.height || "",
      weight: client.weight || "",
      socialSupportProblem: client.socialSupportProblem || "",
      idpoorStatus: client.idpoorStatus || "No",
      idpoorValiddate: safeIdPoor,
      idpoorLevel: client.idpoorLevel || "",
      idpoorAccountNumber: client.idpoorAccountNumber || "",
    });
    setEditingId(client.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      clientCode: "",
      branch: "Phnom Penh",
      gender: "Male",
      status: "Active",
      email: "",
      contactPhone: "",
      photo: "",
      dateOfBirth: "",
      relativePhone: "",
      maritalStatus: "Single",
      address: "",
      province: "Phnom Penh",
      idCard: "",
      currentSituation: "",
      furtherEducation: false,
      placement: false,
      trainingFromFutures: false,
      socialSupportRequired: false,
      hearBy: "",
      expectedSupport: "",
      placeOfBirth: "",
      nationality: "Cambodian",
      citizenship: "Cambodian",
      height: "",
      weight: "",
      socialSupportProblem: "",
      idpoorStatus: "No",
      idpoorValiddate: "",
      idpoorLevel: "",
      idpoorAccountNumber: "",
    });
    setEditingId(null);
    setIsEditMode(false);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    setIsEditMode,
    editingId,
    setEditingId,
    formData,
    setFormData,
    handlePhotoChange,
    handleEdit,
    resetForm,
  };
}
