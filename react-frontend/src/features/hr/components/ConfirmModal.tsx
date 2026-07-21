import React from "react";
import {Modal, ModalHeader, ModalBody, Button} from '@/lib/flowbite-compat';
import { X, AlertTriangle, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) => {
  const isDanger = type === "danger";

  return (
    <Modal show={isOpen} size="md" popup onClose={onClose}>
      <div className="absolute top-4 right-4 z-50">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", padding: 0, boxSizing: "border-box" }}
        >
            <X size={20} />
        </button>
      </div>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          {isDanger ? (
            <AlertTriangle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-500" />
          ) : (
            <Info className="mx-auto mb-4 h-14 w-14 text-blue-600 dark:text-blue-500" />
          )}
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
            {message}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              color={isDanger ? "failure" : "blue"}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
            <Button color="gray" onClick={onClose}>
              {cancelText}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;
