import React, { useState } from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from '@/lib/flowbite-compat';
import {
  Eye,
  Download,
  RefreshCw,
  Trash2,
  UserCircle,
  FileText,
  Award,
  Briefcase,
} from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from '../../../../utils/cloudinary';

interface AttachmentsTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
  isUploading: Record<string, boolean>;
  setIsUploading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const AttachmentsTab: React.FC<AttachmentsTabProps> = ({
  formMethods,
  isUploading,
  setIsUploading,
}) => {
  const { watch, setValue } = formMethods;
  const formData = watch();
  const [confirmAttachmentDelete, setConfirmAttachmentDelete] = useState<
    keyof EmployeeFormData | null
  >(null);

  const handleAttachmentChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof EmployeeFormData,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
        const url = await uploadToCloudinary(file);
        setValue(fieldName, url, { shouldDirty: true });
        toast.success("Attachment uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload attachment");
        console.error(error);
      } finally {
        setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
      }
    }
  };

  const renderAttachmentBox = (
    id: string,
    fieldName: keyof EmployeeFormData,
    label: string,
    Icon: any,
  ) => {
    const url = (formData || {})[fieldName] as string | undefined;
    const isUp = isUploading[fieldName];

    if (url) {
      return (
        <div
          className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl border-green-500 dark:border-green-500 bg-green-50/10 dark:bg-[#252b3b] relative group transition-all duration-300`}
        >
          <div className="flex items-center gap-1 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(url, "_blank");
              }}
              className="flex items-center justify-center w-8 h-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const dUrl = url.includes("cloudinary")
                  ? url.replace("/upload/", "/upload/fl_attachment/")
                  : url;
                window.open(dUrl, "_blank");
              }}
              className="flex items-center justify-center w-8 h-8 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <label
              htmlFor={`upload-${id}`}
              className="flex items-center justify-center w-8 h-8 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-md cursor-pointer transition-colors m-0"
              title="Replace"
            >
              <RefreshCw size={16} />
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmAttachmentDelete(fieldName);
              }}
              className="flex items-center justify-center w-8 h-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div
            className={`p-4 rounded-xl mb-3 bg-green-50 dark:bg-green-500/10 text-green-500 transition-colors`}
          >
            {isUp ? (
              <Spinner size="xl" />
            ) : (
              <Icon size={32} strokeWidth={1.5} />
            )}
          </div>
          <span className="text-xs font-bold text-green-600 dark:text-green-500 tracking-wider">
            {isUp ? "UPLOADING..." : "ATTACHED"}
          </span>

          <input
            type="file"
            id={`upload-${id}`}
            className="hidden"
            accept="image/*,application/pdf"
            onChange={(e) => handleAttachmentChange(e, fieldName)}
          />
        </div>
      );
    }

    return (
      <>
        <input
          type="file"
          id={`upload-${id}`}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => handleAttachmentChange(e, fieldName)}
        />
        <label
          htmlFor={`upload-${id}`}
          className={`flex flex-col items-center justify-center py-8 px-4 rounded-xl  bg-white dark:bg-[#252b3b] hover:bg-gray-50 dark:hover:bg-[#2d3345] transition-colors cursor-pointer group`}
        >
          <div
            className={`p-4 rounded-xl mb-4 transition-colors bg-gray-100 dark:bg-[#2d3345] group-hover:bg-gray-200 dark:group-hover:bg-[#363d52] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400`}
          >
            {isUp ? (
              <Spinner size="xl" />
            ) : (
              <Icon size={32} strokeWidth={1.5} />
            )}
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider">
            {isUp ? "UPLOADING..." : label}
          </span>
        </label>
      </>
    );
  };

  return (
    <>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
            Attachments
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {renderAttachmentBox(
            "photoId",
            "photoIdAttachment",
            "PHOTO ID",
            UserCircle,
          )}
          {renderAttachmentBox(
            "contract",
            "contractAttachment",
            "CONTRACT",
            FileText,
          )}
          {renderAttachmentBox("idpoor", "idPoorAttachment", "ID POOR", Award)}
          {renderAttachmentBox("cv", "cvAttachment", "CV / RESUME", Briefcase)}
        </div>
      </div>

      <Modal
        show={!!confirmAttachmentDelete}
        size="md"
        popup
        onClose={() => setConfirmAttachmentDelete(null)}
        className="z-[9999]"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <Trash2 className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-400" />
            <h3 className="mb-5 text-lg font-black tracking-tight text-gray-700 dark:text-gray-300">
              Delete Attachment?
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Are you sure you want to remove this attachment? You will still
              need to save the form to persist this change.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                color="failure"
                className="px-6 rounded-md font-bold"
                onClick={() => {
                  if (confirmAttachmentDelete) {
                    setValue(confirmAttachmentDelete, undefined, {
                      shouldDirty: true,
                    });
                    setConfirmAttachmentDelete(null);
                  }
                }}
              >
                Delete
              </Button>
              <Button
                color="light"
                className="px-6 rounded-md font-bold"
                onClick={() => setConfirmAttachmentDelete(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AttachmentsTab;
