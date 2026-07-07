import React from "react";
import { createPortal } from "react-dom";
import {Alert, Button} from '@/lib/flowbite-compat';
import { Trash2, AlertTriangle, Info } from "lucide-react";

interface ConfirmModalProps {
  show?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Delete",
  type = "danger",
  isLoading = false,
}) => {
  const isVisible = show ?? isOpen;
  if (!isVisible) return null;

  const Icon =
    type === "danger" ? Trash2 : type === "warning" ? AlertTriangle : Info;

  const content = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 transition-opacity" onClick={onClose} />

      {/* Centered card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-md shadow-2xl overflow-hidden"
          style={{ animation: "popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="px-8 py-2">
            <div className={`w-full h-14 rounded flex items-center justify-center shadow-inner ${type ==="danger"?"text-red-600 dark:text-red-400": type ==="warning"?"bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400":"bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"}`}>
              <div><Icon size={20} /></div>
              <h3 className="text-lg ps-2 text-gray-900 dark:text-gray-200">{title}</h3>
            </div>
            <p className="text-gray-500 text-center dark:text-gray-300 text-base leading-relaxed">{message}</p>
          </div>

          <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/50 flex justify-between gap-3 border-t">
            <button
              onClick={onClose}
              className="px-5 py-1 text-sm font-semibold text-gray-700 bg-white rounded hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={() => {
                onConfirm();
                if (!isLoading) onClose();
              }}
              className={`px-5 py-2 text-sm font-semibold text-white rounded focus:ring-4 focus:outline-none transition-all active:scale-95 shadow-md flex items-center justify-center min-w-[6rem] ${type ==="danger"?"bg-red-600 hover:bg-red-700 focus:ring-red-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 shadow-red-600/20": type ==="warning"?"bg-amber-600 hover:bg-amber-700 focus:ring-amber-200 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-900 shadow-amber-600/20":"bg-blue-600 hover:bg-blue-700 focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 shadow-blue-600/20"}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
};

export default ConfirmModal;
