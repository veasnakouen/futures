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
      className={`flex justify-end items-center w-full px-6 py-4 bg-slate-50/90 dark:bg-[#090c10]/90 backdrop-blur-xl rounded-br-2xl ${hideBorder ? "" : "border-t border-slate-200/60 dark:border-white/[0.05] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]"}`}
    >
      <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 text-[10px] font-black tracking-widest text-slate-500 uppercase bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/10 transition-all shadow-sm hover:shadow active:scale-95"
      >
        {cancelText}
      </button>
      {!hideSubmit && (
        <button
          type="submit"
          form={formId}
          onClick={onSubmit}
          disabled={submitDisabled}
          className="relative px-6 py-2.5 text-[10px] font-black tracking-widest uppercase text-white rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 dark:focus:ring-offset-[#0d1117] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        >
          {/* Shimmer overlay on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <span className="relative">{submitText || defaultSubmitText}</span>
        </button>
      )}
      </div>
    </div>
  );
};
export default CustomModalFooter;
