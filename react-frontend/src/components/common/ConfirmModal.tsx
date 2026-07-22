import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Info, ShieldAlert, X } from "lucide-react";

export interface ConfirmModalProps {
  show?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
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
  confirmText,
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) => {
  const isVisible = show ?? isOpen;
  if (!isVisible && typeof window !== "undefined") return null;

  const defaultConfirmText = confirmText || (type === "danger" ? "Confirm Delete" : type === "warning" ? "Confirm Action" : "Proceed");

  const Icon =
    type === "danger" ? Trash2 : type === "warning" ? AlertTriangle : ShieldAlert;

  const getThemeStyles = () => {
    switch (type) {
      case "danger":
        return {
          accentBg: "from-rose-500 via-red-500 to-pink-500",
          iconBg: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/60 shadow-rose-500/20",
          buttonBg: "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-500/30",
          glowColor: "bg-rose-500/20",
        };
      case "warning":
        return {
          accentBg: "from-amber-500 via-yellow-500 to-orange-400",
          iconBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60 shadow-amber-500/20",
          buttonBg: "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-amber-500/30",
          glowColor: "bg-amber-500/20",
        };
      case "info":
      default:
        return {
          accentBg: "from-indigo-500 via-purple-500 to-blue-500",
          iconBg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-900/60 shadow-indigo-500/20",
          buttonBg: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/30",
          glowColor: "bg-indigo-500/20",
        };
    }
  };

  const theme = getThemeStyles();

  const content = (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* 3D Glass Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/40 border border-white/20 dark:border-gray-800 overflow-hidden z-10"
          >
            {/* Top Accent Gradient Bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${theme.accentBg}`} />

            {/* Close Cross Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X size={16} />
            </button>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 text-center">
              {/* Animated Glowing Icon Badge */}
              <div className="relative inline-block mb-4">
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg ${theme.iconBg}`}>
                  <Icon size={28} />
                </div>
                <div className={`absolute inset-0 rounded-2xl blur-xl ${theme.glowColor} -z-10`} />
              </div>

              {/* Title & Message */}
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {message}
              </p>
            </div>

            {/* Sleek Footer Actions */}
            <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {cancelText}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                onClick={() => {
                  onConfirm();
                  if (!isLoading) onClose();
                }}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${theme.buttonBg}`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{defaultConfirmText}</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
};

export default ConfirmModal;
