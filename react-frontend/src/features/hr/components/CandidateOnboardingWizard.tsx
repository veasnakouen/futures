"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, FileText, CheckCircle, UploadCloud } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  TextInput,
  Button,
  Select,
} from "@/lib/flowbite-compat";
import { ClientFormData } from "@/schemas/recruitmentSchemas";

interface CandidateOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  initialData: any;
  onSubmit: (data: ClientFormData) => Promise<void>;
}

const steps = [
  { id: "basic", label: "Basic Info", icon: <User size={18} /> },
  { id: "placement", label: "Placement Prefs", icon: <Briefcase size={18} /> },
  { id: "skills", label: "Skills & Docs", icon: <FileText size={18} /> },
];

const CandidateOnboardingWizard: React.FC<CandidateOnboardingWizardProps> = ({
  isOpen,
  onClose,
  isEditMode,
  initialData,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    contactPhone: "",
    gender: "Male",
    province: "Phnom Penh",
    clientCode: `TAL-${Date.now().toString().slice(-4)}`,
    branch: "Phnom Penh",
    status: "Searching",
    headline: "",
    desiredSalary: "",
    availability: "",
    preferredLocation: "",
    primarySkills: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData((prev: any) => ({ ...prev, ...initialData }));
      }
      setCurrentStep(0);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      await onSubmit(formData);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <ModalHeader className="border-b-0 pb-0">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {isEditMode ? "Modify Candidate Profile" : "New Candidate Profile"}
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Complete the onboarding steps below to register a new talent profile.
        </p>
      </ModalHeader>
      
      <ModalBody className="pt-4 overflow-hidden flex flex-col gap-6">
        {/* Modern Stepper */}
        <div className="flex items-center justify-between relative bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-xl">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0 pointer-events-none" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 pointer-events-none" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isPassed = index < currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 px-4">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                    ${isActive ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 scale-110" : 
                      isPassed ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700"}`}
                >
                  {isPassed ? <CheckCircle size={18} /> : step.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive || isPassed ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 text-sm font-bold text-gray-900 dark:text-white border-b pb-2 mb-2">Basic Information</div>
                  
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">First Name</Label>
                    <TextInput name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Last Name</Label>
                    <TextInput name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Email Address</Label>
                    <TextInput type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Contact Number</Label>
                    <TextInput name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Gender</Label>
                    <Select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Current Role / Headline</Label>
                    <TextInput name="headline" value={formData.headline || ''} onChange={handleChange} placeholder="e.g. Senior Software Engineer" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 text-sm font-bold text-gray-900 dark:text-white border-b pb-2 mb-2">Placement Preferences</div>
                  
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Desired Salary ($)</Label>
                    <TextInput type="number" name="desiredSalary" value={formData.desiredSalary || ''} onChange={handleChange} placeholder="e.g. 5000" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Availability</Label>
                    <Select name="availability" value={formData.availability || ''} onChange={handleChange}>
                      <option value="">Select availability</option>
                      <option value="Immediately">Immediately</option>
                      <option value="1 Week">1 Week</option>
                      <option value="2 Weeks">2 Weeks</option>
                      <option value="1 Month">1 Month</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Preferred Location</Label>
                    <TextInput name="preferredLocation" value={formData.preferredLocation || ''} onChange={handleChange} placeholder="e.g. Remote, Phnom Penh" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Status</Label>
                    <Select name="status" value={formData.status} onChange={handleChange}>
                      <option value="Searching">Searching</option>
                      <option value="Placed">Placed</option>
                      <option value="Inactive">Inactive</option>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Primary Skills & Experience</div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Primary Skills (comma separated)</Label>
                    <TextInput 
                      name="primarySkills" 
                      value={formData.primarySkills || ''} 
                      onChange={handleChange} 
                      placeholder="e.g. React, Node.js, Project Management" 
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white border-b pb-2 mb-4">Document Uploads</div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <UploadCloud size={32} className="text-blue-500 mb-2" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload Resume/CV</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 5MB</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ModalBody>
      
      <ModalFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <Button
          color="gray"
          onClick={onClose}
          className="font-black uppercase text-[10px] tracking-widest h-11 border-none bg-gray-200 dark:bg-gray-700"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button
              color="gray"
              onClick={handlePrev}
              className="font-black uppercase text-[10px] tracking-widest h-11 border-none bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
            >
              Back
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="font-black uppercase text-[10px] tracking-widest h-11 border-none bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isProcessing={isProcessing}
              className="font-black uppercase text-[10px] tracking-widest h-11 border-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30"
            >
              <CheckCircle size={16} className="mr-2" />
              {isEditMode ? "Update Candidate" : "Enroll Candidate"}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CandidateOnboardingWizard;
