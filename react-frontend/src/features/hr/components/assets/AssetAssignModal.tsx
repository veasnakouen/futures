import React from "react";
import { Modal, ModalBody, Button } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import SearchInput from "@/components/common/SearchInput";
import { UserCheck } from "lucide-react";

interface AssetAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset: any;
  assignSearch: string;
  setAssignSearch: (val: string) => void;
  filteredEmployees: any[];
  onConfirmAssign: (employeeId: number) => void;
  isProcessing: boolean;
}

export const AssetAssignModal: React.FC<AssetAssignModalProps> = ({
  isOpen,
  onClose,
  selectedAsset,
  assignSearch,
  setAssignSearch,
  filteredEmployees,
  onConfirmAssign,
  isProcessing,
}) => {
  if (!isOpen || !selectedAsset) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title="Deploy Hardware Node"
        subtitle={`Assign ${selectedAsset.name} (${selectedAsset.serialNumber}) to staff custodian`}
        onClose={onClose}
      />
      <ModalBody className="p-6 space-y-6">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
            Select Employee Custodian
          </label>
          <SearchInput
            placeholder="Search employee by name..."
            value={assignSearch}
            onChange={(val) => setAssignSearch(val)}
            className="w-full"
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
          {filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-gray-400">
              No active employees match filter
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => onConfirmAssign(emp.id)}
                className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-black dark:text-white group-hover:text-blue-600 transition-colors">
                    {emp.firstNameEnglish} {emp.lastNameEnglish}
                  </h4>
                  <p className="text-[9px] font-bold text-gray-400">
                    {emp.jobTitle || "Staff"} • {emp.departmentName || "General"}
                  </p>
                </div>
                <Button
                  size="xs"
                  color="blue"
                  isProcessing={isProcessing}
                  className="rounded-lg font-black uppercase text-[9px]"
                >
                  <UserCheck size={12} className="mr-1" /> Deploy
                </Button>
              </div>
            ))
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AssetAssignModal;
