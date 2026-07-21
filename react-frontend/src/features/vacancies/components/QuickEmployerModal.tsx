import { X } from "lucide-react";
import React from "react";

import {Modal, ModalHeader, ModalBody, Label, TextInput, Button} from '@/lib/flowbite-compat';

interface QuickEmployerModalProps {
  isOpen: boolean;

  onClose: () => void;

  quickEmployerData: any;

  setQuickEmployerData: (data: any) => void;

  handleSubmit: (e: React.FormEvent) => void;
}

const QuickEmployerModal: React.FC<QuickEmployerModalProps> = ({
  isOpen,
  onClose,
  quickEmployerData,
  setQuickEmployerData,
  handleSubmit,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <div className="absolute top-4 right-4 z-50">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
            <X size={20} />
        </button>
      </div>
      <ModalHeader className="border-none p-0" />

      <ModalBody className="p-0 dark:bg-gray-800">
        <div className="p-10 rounded-md">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-md mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl font-black">+</span>
            </div>

            <h3 className="text-xl font-black dark:text-white leading-tight">
              Quick Employer Add
            </h3>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Direct Node Registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Entity Nomenclature (Company)
              </Label>

              <TextInput
                required
                value={quickEmployerData.name}
                onChange={(e) =>
                  setQuickEmployerData({
                    ...quickEmployerData,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. MTP Logistics Ltd."
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Primary Liaison (Contact Person)
              </Label>

              <TextInput
                value={quickEmployerData.contactPerson}
                onChange={(e) =>
                  setQuickEmployerData({
                    ...quickEmployerData,
                    contactPerson: e.target.value,
                  })
                }
                placeholder="Full Name"
                className="rounded-md"
              />
            </div>

            <div className="flex gap-4 pt-8">
              <Button
                color="light"
                onClick={onClose}
                className="flex-1 rounded-md font-black uppercase text-[10px] h-12"
              >
                Discard
              </Button>

              <Button
                type="submit"
                color="blue"
                className="flex-[2] rounded-md shadow-xl shadow-blue-500/30 font-black uppercase text-[10px] h-12"
              >
                Initialize & Select
              </Button>
            </div>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QuickEmployerModal;
