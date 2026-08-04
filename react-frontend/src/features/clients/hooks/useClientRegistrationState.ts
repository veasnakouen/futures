import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useClientRegistrationState(props: any) {
  const {
    isOpen,
    onClose,
    isEditMode,
    formData,
    setFormData,
    handleSubmit,
    handlePhotoChange,
    clientId,
  } = props;

  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const prevClientId = useRef(clientId);

  const [isAddingSupport, setIsAddingSupport] = useState(false);
  const [newSupportInput, setNewSupportInput] = useState("");

  const { data: expectedSupports = [], refetch: refetchSupports } = useQuery({
    queryKey: ["expectedSupports"],
    queryFn: async () => {
      const res = await api.get("/lookups/expected-supports");
      return res.data;
    },
  });

  const handleAddSupport = async () => {
    if (newSupportInput.trim()) {
      try {
        await api.post("/lookups/expected-supports", {
          name: newSupportInput.trim(),
        });
        handleExpectedSupportChange(newSupportInput.trim(), true);
        setNewSupportInput("");
        setIsAddingSupport(false);
        refetchSupports();
      } catch (err) {
        console.error("Failed to add expected support", err);
      }
    }
  };

  const handleExpectedSupportChange = (name: string, isChecked: boolean) => {
    let current = formData.expectedSupport
      ? formData.expectedSupport
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    if (isChecked) {
      if (!current.includes(name)) current.push(name);
    } else {
      current = current.filter((n: string) => n !== name);
    }

    let updates: any = { expectedSupport: current.join(",") };
    if (name.includes("Further Education")) updates.furtherEducation = isChecked;
    if (name.includes("Placement")) updates.placement = isChecked;
    if (name.includes("Futures Training")) updates.trainingFromFutures = isChecked;
    if (name.includes("Social Support")) updates.socialSupportRequired = isChecked;

    setFormData({ ...formData, ...updates });
  };

  useEffect(() => {
    if (!prevClientId.current && clientId) {
      setCurrentStep(4);
    }
    prevClientId.current = clientId;
  }, [clientId]);

  const isStep1Valid = () => {
    return !!(
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.clientCode?.trim() &&
      formData.branch?.trim() &&
      formData.gender?.trim() &&
      formData.status?.trim()
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleNextStep = (e: any) => {
    if (e && e.preventDefault) e.preventDefault();

    if (currentStep === 1 && !isStep1Valid()) {
      const form = document.getElementById("clientForm") as HTMLFormElement;
      if (form) {
        form.reportValidity();
      }
      return;
    }

    if (currentStep === 3 && !isEditMode) {
      handleSubmit(e);
    } else {
      if (currentStep < 4) setCurrentStep((c) => c + 1);
    }
  };

  const handleSave = (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isStep1Valid()) {
      const form = document.getElementById("clientForm") as HTMLFormElement;
      if (form) {
        setCurrentStep(1);
        setTimeout(() => {
          form.reportValidity();
        }, 100);
      }
      return;
    }
    handleSubmit(e);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((c) => c - 1);
  };

  return {
    currentStep,
    setCurrentStep,
    previewImage,
    setPreviewImage,
    isAddingSupport,
    setIsAddingSupport,
    newSupportInput,
    setNewSupportInput,
    expectedSupports,
    handleAddSupport,
    handleExpectedSupportChange,
    isStep1Valid,
    handleNextStep,
    handleSave,
    handlePrevStep,
    isOpen,
    onClose,
    isEditMode,
    formData,
    setFormData,
    handleSubmit,
    handlePhotoChange,
    clientId,
  };
}
