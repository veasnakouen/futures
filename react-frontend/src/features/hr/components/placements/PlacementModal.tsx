import React from "react";
import { Modal, ModalBody, Label, TextInput, Select } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { Briefcase } from "lucide-react";

interface Props {
  state: any;
}

export default function PlacementModal({ state }: Props) {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    isViewMode,
    formData,
    setFormData,
    placementTypes,
    handleSubmit,
    salaryError,
    setSalaryError,
  } = state;

  if (!isModalOpen) return null;

  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
      <CustomModalHeader
        title={isViewMode ? "Placement Details" : isEditMode ? "Modify Placement Record" : "Initialize Placement"}
        subtitle="Placement Ledger Entry Node"
        icon={<Briefcase className="w-5 h-5" />}
        onClose={() => setIsModalOpen(false)}
      />
      <ModalBody className="p-6 bg-white dark:bg-gray-800">
        <form id="placementForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Client ID / Code</Label>
              <TextInput
                disabled={isViewMode}
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                placeholder="e.g. 101"
              />
            </div>

            <div>
              <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Company Name</Label>
              <TextInput
                disabled={isViewMode}
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Phnom Penh Tech"
              />
            </div>

            <div>
              <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Monthly Salary ($)</Label>
              <TextInput
                type="number"
                disabled={isViewMode}
                required
                value={formData.salary}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, salary: val });
                  if (parseFloat(val) < 0) {
                    setSalaryError("Salary cannot be negative");
                  } else {
                    setSalaryError(null);
                  }
                }}
                placeholder="e.g. 450"
              />
              {salaryError && <p className="text-red-500 text-[10px] font-bold mt-1">{salaryError}</p>}
            </div>

            <div>
              <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Placement Date</Label>
              <DatePicker
                value={formData.placementDate ? new Date(formData.placementDate) : new Date()}
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    placementDate: date ? date.toISOString().split("T")[0] : "",
                  })
                }
              />
            </div>

            <div>
              <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Placement Type</Label>
              <Select
                disabled={isViewMode}
                value={formData.placementType}
                onChange={(e) => setFormData({ ...formData, placementType: e.target.value })}
              >
                <option value="Employment">Employment</option>
                <option value="Internship">Internship</option>
                <option value="Apprenticeship">Apprenticeship</option>
                {placementTypes.map((type: string, idx: number) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label className="mb-1 block text-[10px] uppercase font-black text-gray-400">Status</Label>
              <Select
                disabled={isViewMode}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
              </Select>
            </div>
          </div>
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={() => setIsModalOpen(false)}
        onSubmit={isViewMode ? undefined : handleSubmit as any}
        submitText={isEditMode ? "Save Changes" : "Record Placement"}
        hideSubmit={isViewMode}
      />
    </Modal>
  );
}
