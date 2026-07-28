import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, Button, TextInput, Select, Label } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { UserCheck, Check, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface CandidateOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any;
  onCompleteOnboarding: (data: any) => Promise<void>;
}

const CandidateOnboardingWizard: React.FC<CandidateOnboardingWizardProps> = ({
  isOpen,
  onClose,
  candidate,
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState(1);
  const [employeeCode, setEmployeeCode] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [department, setDepartment] = useState("Engineering");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  if (!candidate) return null;

  const handleFinish = async () => {
    try {
      await onCompleteOnboarding({ candidateId: candidate.id, employeeCode, department, startDate });
      toast.success(`Successfully onboarded ${candidate.firstName || "candidate"}!`);
      onClose();
    } catch {
      toast.error("Failed to complete onboarding wizard");
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <CustomModalHeader title="Candidate Onboarding Wizard" subtitle={`Convert ${candidate.firstName || ""} ${candidate.lastName || ""} to Staff`} onClose={onClose} />
      <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className={`flex items-center gap-2 text-xs font-black uppercase ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono">1</span>
            1. Placement Contract
          </div>
          <ArrowRight size={14} className="text-gray-300" />
          <div className={`flex items-center gap-2 text-xs font-black uppercase ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono">2</span>
            2. System Provisioning
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-1">Assign Employee Code</Label>
              <TextInput value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} sizing="sm" className="font-mono font-bold" />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-1">Assign Department</Label>
              <Select value={department} onChange={(e) => setDepartment(e.target.value)} sizing="sm">
                <option value="Engineering">Engineering & IT</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Retail Operations">Retail & POS</option>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-1">Official Start Date</Label>
              <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} sizing="sm" />
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-bold">
              <p>Ready to activate employee profile and generate HR credentials!</p>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t justify-between">
        <Button color="gray" onClick={onClose} className="font-black uppercase text-[10px] h-10">Cancel</Button>
        {step === 1 ? (
          <Button color="blue" onClick={() => setStep(2)} className="font-black uppercase text-[10px] h-10">
            Next Step <ArrowRight size={14} className="ml-1" />
          </Button>
        ) : (
          <Button color="success" onClick={handleFinish} className="font-black uppercase text-[10px] h-10 bg-emerald-600">
            <Check size={14} className="mr-1" /> Complete Onboarding
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CandidateOnboardingWizard;
