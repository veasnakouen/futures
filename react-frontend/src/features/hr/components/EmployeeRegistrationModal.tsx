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
            "relative flex max-h-[90dvh] flex-col rounded-2xl bg-white shadow-2xl dark:bg-[#0d1117] !overflow-visible border border-white/20 dark:border-white/[0.05]",
        },
      }}
    >
      <CustomModalHeader
        title={isEditMode ? "Modify Personnel Record" : "Onboard New Staff"}
        subtitle="Human Resources Module"
        onClose={onClose}
      />
      <ModalBody className="!p-0 !pb-0 !mb-0 dark:bg-[#0d1117] overflow-hidden rounded-b-2xl flex flex-col">
        <div className="flex h-[480px] overflow-hidden relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Form Sidebar - Premium Glassmorphic */}
          <div className="w-[190px] bg-gray-50/80 dark:bg-white/[0.02] backdrop-blur-xl border-r border-gray-100 dark:border-white/[0.05] px-3 py-4 sticky top-0 h-full shrink-0 flex flex-col z-10">
            <h4 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 pl-2">Navigation</h4>
            <nav className="space-y-1 flex-1 overflow-y-hidden">
              {[
                {
                  id: "personal",
                  label: "Personal Data",
                  icon: <User size={15} strokeWidth={2.5} />,
                },
                {
                  id: "employment",
                  label: "Employment",
                  icon: <Briefcase size={15} strokeWidth={2.5} />,
                },
                {
                  id: "financial",
                  label: "Financial",
                  icon: <DollarSign size={15} strokeWidth={2.5} />,
                },
                {
                  id: "emergency",
                  label: "Emergency",
                  icon: <ShieldCheck size={15} strokeWidth={2.5} />,
                },
                {
                  id: "experience",
                  label: "Experience",
                  icon: <Briefcase size={15} strokeWidth={2.5} />,
                },
                {
                  id: "biometric",
                  label: "Biometrics",
                  icon: <ShieldCheck size={15} strokeWidth={2.5} />,
                },
                {
                  id: "custom",
                  label: "Custom Fields",
                  icon: <Plus size={15} strokeWidth={2.5} />,
                },
                {
                  id: "attachments",
                  label: "Attachments",
                  icon: <Paperclip size={15} strokeWidth={2.5} />,
                },
              ].map((t, index) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRegTab(t.id as any)}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 group overflow-hidden active:scale-95 animate-fade-in-up ${regTab === t.id
                    ? "text-white shadow-sm shadow-indigo-500/25 border-transparent"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-white/[0.04] border border-transparent hover:border-gray-200 dark:hover:border-white/[0.05] hover:shadow-sm"
                    }`}
                  style={regTab === t.id
                    ? { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", animationDelay: `${index * 40}ms`, animationFillMode: "both" }
                    : { animationDelay: `${index * 40}ms`, animationFillMode: "both" }}
                >
                  {regTab === t.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                  )}
                  <span className="flex items-center gap-3 relative z-10">
                    <span className={`transition-all duration-300 ${regTab === t.id ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-6"}`}>{t.icon}</span>
                    <span className={`transition-all duration-300 ${regTab === t.id ? "" : "group-hover:translate-x-1"}`}>{t.label}</span>
                  </span>
                  {hasErrorInTab(t.id) && (
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] relative z-10"></div>
                  )}
                </button>
              ))}
            </nav>
            <div className="pt-4 mt-auto border-t border-gray-200/50 dark:border-white/[0.05]">
              <div className="flex items-center text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase pl-2">
                <span className="relative flex w-2 h-2 mr-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Secure Session
              </div>
            </div>
          </div>

          {/* Form Content & Right-Side Sticky Footer Column */}
          <div className="flex-1 flex flex-col h-full relative z-10 bg-white/50 dark:bg-transparent">
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar relative">
              <form
                id="employee-form"
                onSubmit={hookSubmit(onSubmit)}
                className="space-y-8 animate-fade-in-up"
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
            {/* Right-aligned Modal Footer */}
            <div className="shrink-0 w-full z-20 relative">
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
                hideBorder={false}
              />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EmployeeRegistrationModal;
