import React from "react";
import { Modal, ModalHeader, ModalBody, Button } from '@/lib/flowbite-compat';
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
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm border border-gray-100 dark:border-gray-700"
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
