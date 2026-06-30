import React from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  TextInput,
  Button,
} from '@/lib/flowbite-compat';
import { Briefcase } from "lucide-react";

interface QuickJobPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quickJobPositionData: any;
  setQuickJobPositionData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const QuickJobPositionModal: React.FC<QuickJobPositionModalProps> = ({
  isOpen,
  onClose,
  quickJobPositionData,
  setQuickJobPositionData,
  handleSubmit,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b dark:border-gray-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-md">
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Add Job Position
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Create a new designation
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">
              Position Name
            </Label>
            <TextInput
              required
              value={quickJobPositionData.name}
              onChange={(e) =>
                setQuickJobPositionData({
                  ...quickJobPositionData,
                  name: e.target.value,
                })
              }
              className="rounded-md"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <Button
              color="light"
              size="sm"
              onClick={onClose}
              className="rounded-md uppercase text-[10px] font-bold"
            >
              Cancel
            </Button>
            <Button
              color="blue"
              size="sm"
              type="submit"
              className="rounded-md uppercase text-[10px] font-bold"
            >
              Save Position
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default QuickJobPositionModal;
