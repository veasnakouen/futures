import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import {Modal, ModalBody} from "@/lib/flowbite-compat";

const schema = z.object({
  name: z.string().min(1, "Required"),
  icd10Code: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (name: string) => void;
}

export default function AddDiagnosisModal({ isOpen, onClose, onAdded }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      reset({ name: "", icd10Code: "", description: "" });
    }
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => clinicService.createDiagnosisTemplate(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis-templates"] });
      toast.success("Diagnosis added successfully");
      if (onAdded) {
        // Pass the name back so we can automatically select it
        onAdded(res.data?.name || "");
      }
      onClose();
    },
    onError: () => toast.error("Failed to add diagnosis")
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup>
      <CustomModalHeader title="Add New Diagnosis" onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis Name *</label>
            <input 
              {...register("name")} 
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder="e.g. Type 2 Diabetes"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ICD-10 Code</label>
            <input 
              {...register("icd10Code")} 
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. E11.9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              {...register("description")} 
              rows={2} 
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
            />
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText="Save Diagnosis" submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
