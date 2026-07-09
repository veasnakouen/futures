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
      className={`flex justify-end gap-3 w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl ${hideBorder ? "" : "border-t border-gray-100 dark:border-gray-800"}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2 text-sm font-bold tracking-wide text-gray-600 uppercase bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 transition-all shadow-sm"
      >
        {cancelText}
      </button>
      {!hideSubmit && (
        <button
          type="submit"
          form={formId}
          onClick={onSubmit}
          disabled={submitDisabled}
          className="px-6 py-2 text-sm font-bold tracking-wide uppercase text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/30 transform hover:scale-[1.02] active:scale-95"
        >
          {submitText || defaultSubmitText}
        </button>
      )}
    </div>
  );
};
export default CustomModalFooter;
