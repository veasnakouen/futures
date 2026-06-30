import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import {
  User,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Plus,
  Paperclip,
} from "lucide-react";
import { useAuthStore } from '@/store/authStore';
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '@/schemas/employeeSchema';

// Import extracted tab components
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
  regTab:
    | "personal"
    | "employment"
    | "financial"
    | "emergency"
    | "experience"
    | "custom"
    | "biometric"
    | "attachments";
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
  const {
    handleSubmit: hookSubmit,
    formState: { errors },
  } = formMethods;
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const { user: currentUser } = useAuthStore();
  const isAdminOrSuper =
    currentUser?.roles?.some(
      (r) =>
        r === "Admin" ||
        r === "SUPERADMIN" ||
        r === "SuperAdmin" ||
        r === "ADMIN",
    ) || false;

  const hasErrorInTab = (tab: string) => {
    const fieldGroups: Record<string, (keyof EmployeeFormData)[]> = {
      personal: [
        "firstNameEnglish",
        "lastNameEnglish",
        "firstNameKhmer",
        "lastNameKhmer",
        "email",
        "phoneNumber",
        "address",
        "title",
        "gender",
        "dateOfBirth",
        "bloodGroup",
        "nationality",
        "placeOfBirth",
        "maritalStatus",
        "children",
        "identityCardType",
        "identityCardNumber",
      ],
      employment: [
        "idNo",
        "joinDate",
        "department",
        "position",
        "contractType",
        "status",
      ],
      financial: ["basicSalary", "bankName", "bankAccountNumber"],
      emergency: [
        "emergencyContactName",
        "emergencyContact",
        "emergencyContactPhone",
      ],
      biometric: ["biometricStatus", "biometricId"],
      custom: ["customFields"],
      attachments: [
        "photoIdAttachment",
        "contractAttachment",
        "idPoorAttachment",
        "cvAttachment",
      ],
    };
    const fields = fieldGroups[tab];
    if (!fields) return false;
    return fields.some((field) => errors[field]);
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="4xl"
      theme={{
        content: {
          inner:
            "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700 !overflow-visible",
        },
      }}
    >
      <CustomModalHeader
        title={isEditMode ? "Modify Personnel Record" : "Onboard New Staff"}
        subtitle="Human Resources Module"
        onClose={onClose}
      />
      <ModalBody className="p-0 dark:bg-gray-800 overflow-hidden">
        <div className="flex h-[450px] overflow-hidden">
          {/* Form Sidebar - Sticky to the Modal Body */}
          <div className="w-64 bg-gray-50 dark:bg-gray-700/30 border-r dark:border-gray-700 p-8 sticky top-0 h-[450px] shrink-0">
            <nav className="space-y-1">
              {[
                {
                  id: "personal",
                  label: "Personal Data",
                  icon: <User size={14} />,
                },
                {
                  id: "employment",
                  label: "Employment",
                  icon: <Briefcase size={14} />,
                },
                {
                  id: "financial",
                  label: "Financial",
                  icon: <DollarSign size={14} />,
                },
                {
                  id: "emergency",
                  label: "Emergency",
                  icon: <ShieldCheck size={14} />,
                },
                {
                  id: "experience",
                  label: "Experience",
                  icon: <Briefcase size={14} />,
                },
                {
                  id: "biometric",
                  label: "Biometrics",
                  icon: <ShieldCheck size={14} />,
                },
                {
                  id: "custom",
                  label: "Custom Fields",
                  icon: <Plus size={14} />,
                },
                {
                  id: "attachments",
                  label: "Attachments",
                  icon: <Paperclip size={14} />,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRegTab(t.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${regTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <span className="flex items-center gap-3">
                    {t.icon} {t.label}
                  </span>
                  {hasErrorInTab(t.id) && (
                    <div className="w-2 h-2 rounded-md bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content & Right-Side Sticky Footer Column */}
          <div className="flex-1 flex flex-col h-[450px] overflow-hidden">
            <div className="flex-1 p-10 overflow-y-auto scrollbar-hide">
              <form
                id="employee-form"
                onSubmit={hookSubmit(onSubmit)}
                className="space-y-8 pb-6"
              >
                {regTab === "personal" && (
                  <PersonalDataTab
                    formMethods={formMethods}
                    isAdminOrSuper={isAdminOrSuper}
                    employeeId={undefined}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />
                )}
                {regTab === "employment" && (
                  <EmploymentTab formMethods={formMethods} />
                )}
                {regTab === "financial" && (
                  <FinancialTab formMethods={formMethods} />
                )}
                {regTab === "emergency" && (
                  <EmergencyTab formMethods={formMethods} />
                )}
                {regTab === "biometric" && (
                  <BiometricsTab
                    formMethods={formMethods}
                    isEnrolling={isEnrolling}
                    setIsEnrolling={setIsEnrolling}
                    enrollmentProgress={enrollmentProgress}
                    setEnrollmentProgress={setEnrollmentProgress}
                  />
                )}
                {regTab === "experience" && (
                  <ExperienceTab formMethods={formMethods} />
                )}
                {regTab === "custom" && (
                  <CustomFieldsTab formMethods={formMethods} />
                )}
                {regTab === "attachments" && (
                  <AttachmentsTab
                    formMethods={formMethods}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />
                )}
              </form>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 p-4 shrink-0 w-full">
              <CustomModalFooter
                onClose={onClose}
                isEditMode={isEditMode}
                submitText={isEditMode ? "Update Record" : "Enroll Staff"}
                submitDisabled={
                  isEnrolling ||
                  Object.values(isUploading).some((v) => v) ||
                  formMethods.formState.isSubmitting
                }
                formId="employee-form"
                hideBorder={true}
              />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EmployeeRegistrationModal;
