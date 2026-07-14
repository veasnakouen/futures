"use client";
import React from "react";

interface CustomModalFooterProps {
  onClose: () => void;
  isEditMode?: boolean;
  submitText?: React.ReactNode | string;
  cancelText?: string;
  onSubmit?: () => void;
  formId?: string;
  hideSubmit?: boolean;
  submitDisabled?: boolean;
  hideBorder?: boolean;
}

const CustomModalFooter: React.FC<CustomModalFooterProps> = ({
  onClose,
  isEditMode = false,
  submitText,
  cancelText = "Discard",
  onSubmit,
  formId,
  hideSubmit = false,
  submitDisabled = false,
  hideBorder = false,
}) => {
  const defaultSubmitText = isEditMode ? "Update Record" : "Save Record";
  return (
    <div
      className={`flex justify-end items-center gap-3 w-full px-6 py-4 bg-gray-50/60 dark:bg-white/[0.02] rounded-b-xl ${hideBorder ? "" : "border-t border-gray-100 dark:border-white/[0.05]"}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-[11px] font-bold tracking-wider text-gray-500 uppercase bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.07] rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.07] hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-white/10 transition-all shadow-sm"
      >
        {cancelText}
      </button>
      {!hideSubmit && (
        <button
          type="submit"
          form={formId}
          onClick={onSubmit}
          disabled={submitDisabled}
          className="relative px-5 py-2 text-[11px] font-bold tracking-wider uppercase text-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 dark:focus:ring-offset-[#0d1117] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-px active:translate-y-0 group"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          {/* Shimmer overlay on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <span className="relative">{submitText || defaultSubmitText}</span>
        </button>
      )}
    </div>
  );
};
export default CustomModalFooter;
