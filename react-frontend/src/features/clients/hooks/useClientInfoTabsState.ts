import { useState } from "react";

export interface ClientInfoTabsProps {
  client: any;
  educations?: any[];
  familyMembers?: any[];
  healthRecords?: any[];
  cases?: any[];
  documents?: any[];
}

export function useClientInfoTabsState({ educations }: { educations?: any[] }) {
  const [activeTab, setActiveTab] = useState("Client Information");
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const tabs = [
    "Client Information",
    "Administration Information",
    "Family Information",
    "Health Information",
    "Case Summary",
    "Document Management",
  ];

  const getAge = (dob: string) => {
    if (!dob) return "";
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const currentEducation = educations && educations.length > 0 ? educations[0] : null;

  return {
    activeTab,
    setActiveTab,
    tabs,
    isFamilyModalOpen,
    setIsFamilyModalOpen,
    isHealthModalOpen,
    setIsHealthModalOpen,
    isCaseModalOpen,
    setIsCaseModalOpen,
    isDocModalOpen,
    setIsDocModalOpen,
    getAge,
    currentEducation,
  };
}
