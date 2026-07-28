import React, { useState } from "react";
import { Modal, ModalBody } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { User, Briefcase, DollarSign, ShieldCheck, Paperclip } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '@/schemas/employeeSchema';

import PersonalDataTab from "./employee-registration/PersonalDataTab";
import EmploymentTab from "./employee-registration/EmploymentTab";
import FinancialTab from "./employee-registration/FinancialTab";
import EmergencyTab from "./employee-registration/EmergencyTab";
import BiometricsTab from "./employee-registration/BiometricsTab";
import ExperienceTab from "./employee-registration/ExperienceTab";
import CustomFieldsTab from "./employee-registration/CustomFieldsTab";
import AttachmentsTab from "./employee-registration/AttachmentsTab";

interface EmployeeRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  regTab: "personal" | "employment" | "financial" | "emergency" | "experience" | "custom" | "biometric" | "attachments";
  setRegTab: (tab: any) => void;
  formMethods: UseFormReturn<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => void;
}

const EmployeeRegistrationModal: React.FC<EmployeeRegistrationModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  regTab,
  setRegTab,
  formMethods,
  onSubmit,
}) => {
  const { handleSubmit: hookSubmit, formState: { isSubmitting } } = formMethods;
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const navItems = [
    { id: "personal", label: "1. Personal Data", icon: <User size={13} /> },
    { id: "employment", label: "2. Employment", icon: <Briefcase size={13} /> },
    { id: "financial", label: "3. Financial", icon: <DollarSign size={13} /> },
    { id: "emergency", label: "4. Contacts", icon: <User size={13} /> },
    { id: "experience", label: "5. History", icon: <Briefcase size={13} /> },
    { id: "biometric", label: "6. Biometrics", icon: <ShieldCheck size={13} /> },
    { id: "attachments", label: "7. Documents", icon: <Paperclip size={13} /> },
    { id: "custom", label: "8. Custom Fields", icon: <User size={13} /> },
  ];

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <CustomModalHeader title={isEditMode ? "Edit Staff Profile" : "Register New Employee"} subtitle="HR Workforce Onboarding Portal" onClose={onClose} />
      <form onSubmit={hookSubmit(onSubmit)}>
        <ModalBody className="p-0 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row min-h-[520px] max-h-[75vh]">
            {/* Left Nav (Non-scrollable, shrink-wrapped sidebar) */}
            <div className="w-full md:w-64 bg-gray-50/80 dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800 p-4 space-y-1 shrink-0 select-none overflow-hidden flex flex-col justify-start">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRegTab(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all ${
                    regTab === item.id 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon} <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {regTab === "personal" && (
                <PersonalDataTab
                  formMethods={formMethods}
                  isAdminOrSuper={true}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
              )}
              {regTab === "employment" && <EmploymentTab formMethods={formMethods} />}
              {regTab === "financial" && <FinancialTab formMethods={formMethods} />}
              {regTab === "emergency" && <EmergencyTab formMethods={formMethods} />}
              {regTab === "experience" && <ExperienceTab formMethods={formMethods} />}
              {regTab === "biometric" && (
                <BiometricsTab
                  formMethods={formMethods}
                  isEnrolling={isEnrolling}
                  setIsEnrolling={setIsEnrolling}
                  enrollmentProgress={enrollmentProgress}
                  setEnrollmentProgress={setEnrollmentProgress}
                />
              )}
              {regTab === "attachments" && (
                <AttachmentsTab
                  formMethods={formMethods}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
              )}
              {regTab === "custom" && <CustomFieldsTab formMethods={formMethods} />}
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEditMode ? "Update Staff Member" : "Register Staff Member"} />
      </form>
    </Modal>
  );
};

export default EmployeeRegistrationModal;
