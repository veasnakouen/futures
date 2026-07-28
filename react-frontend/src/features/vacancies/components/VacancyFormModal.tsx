import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalBody, Label, TextInput, Textarea, Select } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { toast } from "react-hot-toast";

export interface VacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancyToEdit?: any;
  onSave?: (data: any) => Promise<void>;
  [key: string]: any;
}

export default function VacancyFormModal({
  isOpen,
  onClose,
  vacancyToEdit,
  onSave = async () => {},
}: VacancyFormModalProps) {
  const isEdit = !!vacancyToEdit;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  useEffect(() => {
    if (isOpen) {
      if (vacancyToEdit) reset(vacancyToEdit);
      else reset({ status: "OPEN", employmentType: "FULL_TIME", location: "Phnom Penh" });
    }
  }, [isOpen, vacancyToEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
      toast.success(isEdit ? "Job vacancy updated" : "Job vacancy published");
      onClose();
    } catch {
      toast.error("Failed to save vacancy");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" dismissible={false}>
      <CustomModalHeader
        title={isEdit ? "Modify Job Vacancy" : "Post New Job Opportunity"}
        subtitle="Recruitment ATS Module"
        onClose={onClose}
      />
      <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4 text-xs">
        <form id="vacancy-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Job Title</Label>
            <TextInput {...register("title", { required: "Title is required" })} sizing="sm" placeholder="e.g. Senior Software Architect" />
            {errors.title && <p className="text-red-500 text-[10px]">{errors.title.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Department</Label>
              <TextInput {...register("department")} sizing="sm" placeholder="Engineering / HR" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Employment Type</Label>
              <Select {...register("employmentType")} sizing="sm">
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Location</Label>
              <TextInput {...register("location")} sizing="sm" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Salary Range ($ USD)</Label>
              <TextInput {...register("salaryRange")} placeholder="e.g. $1,500 - $2,500" sizing="sm" />
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Job Description & Qualifications</Label>
            <Textarea {...register("description")} rows={4} placeholder="Describe duties and skill requirements..." />
          </div>
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={isEdit}
        submitText={isEdit ? "Update Job" : "Publish Vacancy"}
        formId="vacancy-form"
      />
    </Modal>
  );
}
