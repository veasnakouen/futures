import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Textarea, Spinner } from '@/lib/flowbite-compat';
import { Zap, Users } from "lucide-react";
import { toast } from "react-hot-toast";

interface AlumniJobTipModalProps {
  show: boolean;
  onClose: () => void;
  candidates: any[];
  onAddVacancy: (data: any) => Promise<void>;
}

const AlumniJobTipModal: React.FC<AlumniJobTipModalProps> = ({
  show,
  onClose,
  candidates,
  onAddVacancy,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobTipForm, setJobTipForm] = useState({
    referrerCandidateId: "",
    companyName: "",
    jobTitle: "",
    positionsCount: 1,
    estimatedSalary: "$800 - $1,200",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTipForm.companyName || !jobTipForm.jobTitle) {
      toast.error("Company name and job title are required");
      return;
    }
    try {
      setIsProcessing(true);
      const candidate = candidates.find(
        (c: any) => String(c.id) === jobTipForm.referrerCandidateId
      );
      const candidateName = candidate
        ? `${candidate.firstName} ${candidate.lastName}`
        : "Alumni Client";

      await onAddVacancy({
        employerId: jobTipForm.companyName,
        jobPositionId: jobTipForm.jobTitle,
        positionAvailable: Number(jobTipForm.positionsCount) || 1,
        salary: jobTipForm.estimatedSalary || "Negotiable",
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        contractType: "Full-Time",
        status: "Open",
        applicationInformation: `Internal vacancy tip provided by Alumni Client: ${candidateName}. Notes: ${jobTipForm.notes || "N/A"}`,
      });

      toast.success(
        `Alumni Job Lead logged! Published new vacancy from ${candidateName}.`
      );
      onClose();
      setJobTipForm({
        referrerCandidateId: "",
        companyName: "",
        jobTitle: "",
        positionsCount: 1,
        estimatedSalary: "$800 - $1,200",
        notes: "",
      });
    } catch (err) {
      toast.error("Failed to log job tip");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="lg">
      <ModalHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-emerald-200 animate-pulse" />
          <span className="font-black">Alumni Client Job Referral & Lead Tracker</span>
        </div>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4 p-6 bg-white dark:bg-gray-800">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
            <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Users size={14} /> Client Alumni Network Referral Engine
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Placed clients working at companies often share internal hiring leads. Log their referral tips here to automatically generate new vacancy postings.
            </p>
          </div>

          <div>
            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
              Client Referrer (Who provided this job lead?)
            </Label>
            <select
              value={jobTipForm.referrerCandidateId}
              onChange={(e) =>
                setJobTipForm({
                  ...jobTipForm,
                  referrerCandidateId: e.target.value,
                })
              }
              className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-xs font-bold text-gray-900 dark:text-white px-3"
            >
              <option value="">-- Select Client / Alumni --</option>
              {candidates.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.clientCode || "Client"}) -{" "}
                  {c.currentSituation || "Placed Candidate"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
                Company / Organization
              </Label>
              <TextInput
                required
                value={jobTipForm.companyName}
                onChange={(e) =>
                  setJobTipForm({ ...jobTipForm, companyName: e.target.value })
                }
                placeholder="e.g. Phnom Penh Tech Solutions"
                className="rounded-md text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
                Open Job Title / Position
              </Label>
              <TextInput
                required
                value={jobTipForm.jobTitle}
                onChange={(e) =>
                  setJobTipForm({ ...jobTipForm, jobTitle: e.target.value })
                }
                placeholder="e.g. Senior Java Developer"
                className="rounded-md text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
                Number of Open Positions
              </Label>
              <TextInput
                type="number"
                min="1"
                value={jobTipForm.positionsCount}
                onChange={(e) =>
                  setJobTipForm({
                    ...jobTipForm,
                    positionsCount: Number(e.target.value),
                  })
                }
                className="rounded-md text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
                Estimated Salary Range
              </Label>
              <TextInput
                value={jobTipForm.estimatedSalary}
                onChange={(e) =>
                  setJobTipForm({
                    ...jobTipForm,
                    estimatedSalary: e.target.value,
                  })
                }
                placeholder="e.g. $800 - $1,200"
                className="rounded-md text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
              Additional Notes / Internal Department Details
            </Label>
            <Textarea
              rows={3}
              value={jobTipForm.notes}
              onChange={(e) =>
                setJobTipForm({ ...jobTipForm, notes: e.target.value })
              }
              placeholder="e.g. Sokha mentioned her engineering department needs 2 leads before Q3."
              className="rounded-md text-xs"
            />
          </div>
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button
            color="gray"
            onClick={onClose}
            className="font-black uppercase text-[10px] tracking-widest h-11"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="emerald"
            disabled={isProcessing}
            className="flex-1 font-black uppercase text-[10px] tracking-widest h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isProcessing ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <Zap size={16} className="mr-2" />
            )}
            Publish Internal Job Lead
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AlumniJobTipModal;
