import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService } from "../../../services/clinicService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import { Activity, FileCode, FileText } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Diagnosis Name is required"),
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

  React.useEffect(() => {
    if (isOpen) {
      reset({ name: "", icd10Code: "", description: "" });
    }
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => clinicService.createDiagnosisTemplate(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis-templates"] });
      toast.success("Diagnosis template saved successfully");
      if (onAdded) {
        onAdded(res.data.name);
      }
      onClose();
    },
    onError: () => toast.error("Failed to save diagnosis template")
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title="Add Diagnosis Template"
        subtitle="ICD-10 Diagnostic Template Registration"
        onClose={onClose}
        icon={<Activity size={20} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Diagnosis Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...register("name")}
                  placeholder="e.g. Type 2 Diabetes Mellitus"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              {errors.name && <span className="text-rose-500 text-xs font-bold mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                ICD-10 Code
              </label>
              <div className="relative">
                <FileCode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  {...register("icd10Code")}
                  placeholder="e.g. E11.9"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Clinical Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Enter diagnostic criteria or clinical notes..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText="Save Diagnosis Template" submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
