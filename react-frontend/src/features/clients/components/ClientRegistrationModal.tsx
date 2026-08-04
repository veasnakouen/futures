import React from "react";
import { Modal, ModalBody, Button } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { ChevronRight, Check } from "lucide-react";
import { useClientRegistrationState } from "@/features/clients/hooks/useClientRegistrationState";

import RegistrationStepper from "./registration/RegistrationStepper";
import Step1BasicInfo from "./registration/Step1BasicInfo";
import Step2ContactInfo from "./registration/Step2ContactInfo";
import Step3AssessmentInfo from "./registration/Step3AssessmentInfo";
import Step4AdvancedInfo from "./registration/Step4AdvancedInfo";

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clientId?: number | string;
}

const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = (props) => {
  const state = useClientRegistrationState(props);
  const {
    isOpen,
    onClose,
    isEditMode,
    currentStep,
    setCurrentStep,
    isStep1Valid,
    handleNextStep,
    handleSave,
    handlePrevStep,
    formData,
    setFormData,
    handleSubmit,
    handlePhotoChange,
    clientId,
  } = state;

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader
        title={isEditMode ? "Modify Client Profile" : "Execute New Registration"}
        subtitle="System Node: Client_Registry_v4"
        onClose={onClose}
      />

      <ModalBody className="bg-gray-50 dark:bg-gray-900 px-0 py-0 overflow-hidden flex flex-col">
        {/* Stepper Header */}
        <RegistrationStepper
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isEditMode={isEditMode}
          clientId={clientId}
          isStep1Valid={isStep1Valid}
        />

        {/* Wizard Form Steps */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="clientForm" onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <Step1BasicInfo
                formData={formData}
                setFormData={setFormData}
                handlePhotoChange={handlePhotoChange}
              />
            )}

            {currentStep === 2 && (
              <Step2ContactInfo formData={formData} setFormData={setFormData} />
            )}

            {currentStep === 3 && (
              <Step3AssessmentInfo formData={formData} setFormData={setFormData} state={state} />
            )}

            {currentStep === 4 && (
              <Step4AdvancedInfo clientId={clientId} formData={formData} setFormData={setFormData} />
            )}
          </form>
        </div>

        {/* Wizard Footer Controls */}
        <div className="bg-white dark:bg-gray-800 border-t p-4 px-6 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              currentStep === 1
                ? "opacity-0 cursor-default"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            Back
          </button>

          <div className="flex gap-2">
            {isEditMode && (
              <Button
                color="blue"
                onClick={handleSave}
                className="rounded-lg font-bold text-xs uppercase tracking-wider"
              >
                Save Changes
              </Button>
            )}

            {currentStep < 4 && (
              <Button
                color="blue"
                onClick={handleNextStep}
                className="rounded-lg font-bold text-xs uppercase tracking-wider"
              >
                {currentStep === 3 && !isEditMode ? (
                  <>
                    Complete Intake <Check size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    Next Step <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ClientRegistrationModal;
