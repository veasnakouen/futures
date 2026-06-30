"use client";
import React from "react";
import { Button } from "@/lib/flowbite-compat";
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
      className={`flex justify-end gap-4 w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-b-lg ${hideBorder ? "" : "border-t dark:border-gray-700"}`}
    >
      {" "}
      <Button
        color="light"
        size="sm"
        onClick={onClose}
        className="rounded-md px-6 font-black uppercase text-[10px] shadow-sm transition-all"
      >
        {" "}
        {cancelText}{" "}
      </Button>{" "}
      {!hideSubmit && (
        <Button
          type="submit"
          form={formId}
          onClick={onSubmit}
          disabled={submitDisabled}
          size="sm"
          color="blue"
          outline
          className="rounded-md font-bold uppercase text-[10px] shadow-sm transition-all focus:ring-2"
        >
          {" "}
          {submitText || defaultSubmitText}{" "}
        </Button>
      )}{" "}
    </div>
  );
};
export default CustomModalFooter;
