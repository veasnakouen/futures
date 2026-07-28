import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Spinner, Avatar } from '@/lib/flowbite-compat';
import { UserCheck, CheckCircle } from "lucide-react";
import DatePicker from "@/components/common/DatePicker";
import { toast } from "react-hot-toast";

interface PlacementModalProps {
  show: boolean;
  onClose: () => void;
  candidate: any;
  onPlaceCandidate: (data: any) => Promise<void>;
}

const PlacementModal: React.FC<PlacementModalProps> = ({
  show,
  onClose,
  candidate,
  onPlaceCandidate,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    jobPositionId: "1",
    salary: 800,
    placementDate: new Date().toISOString().split("T")[0],
    placementType: "Direct Hire",
    status: "Placed",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      toast.error("Company name is required");
      return;
    }
    try {
      setIsProcessing(true);
      await onPlaceCandidate({
        ...formData,
        clientId: candidate?.id,
      });
      toast.success("Placement confirmed! Candidate hired.");
      onClose();
    } catch (err) {
      toast.error("Failed to confirm placement");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="lg">
      <ModalHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <UserCheck size={20} className="text-blue-200" />
          <span className="font-black">Confirm Talent Placement & Hiring</span>
        </div>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4 p-6 bg-white dark:bg-gray-800">
          {candidate && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-4 border">
              <Avatar img={candidate.photo} rounded size="md" />
              <div>
                <h4 className="font-black dark:text-white text-base">
                  {candidate.firstName} {candidate.lastName}
                </h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {candidate.clientCode} &bull; {candidate.branch}
                </p>
              </div>
            </div>
          )}

          <div>
            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
              Hiring Company Name
            </Label>
            <TextInput
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Phnom Penh Tech Solutions"
              className="rounded-md text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
                Agreed Monthly Salary ($)
              </Label>
              <TextInput
                type="number"
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="rounded-md text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
                Placement Type
              </Label>
              <select
                value={formData.placementType}
                onChange={(e) => setFormData({ ...formData, placementType: e.target.value })}
                className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-xs font-bold text-gray-900 dark:text-white px-3"
              >
                <option value="Direct Hire">Direct Hire</option>
                <option value="Contract">Contract Sourcing</option>
                <option value="Internship">Internship / Trainee</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">
              Hire / Placement Date
            </Label>
            <DatePicker
              value={formData.placementDate ? new Date(formData.placementDate) : new Date()}
              onChange={(d: Date | null) =>
                setFormData({
                  ...formData,
                  placementDate: d ? d.toISOString().split("T")[0] : "",
                })
              }
              className="w-full h-10 text-xs rounded-md"
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
            color="success"
            disabled={isProcessing}
            className="flex-1 font-black uppercase text-[10px] tracking-widest h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isProcessing ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <CheckCircle size={16} className="mr-2" />
            )}
            Confirm Hire
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default PlacementModal;
