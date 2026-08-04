"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, GuestDto } from "../../../services/hotelService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody, Datepicker } from "@/lib/flowbite-compat";
import { Upload, FileCheck, Info, AlertCircle } from "lucide-react";

const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email format (e.g. user@domain.com)").optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  idProofNumber: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: GuestDto | null;
}

export default function GuestFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;
  const [docPreview, setDocPreview] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
        setDocPreview(itemToEdit.idProofNumber?.startsWith("data:") ? itemToEdit.idProofNumber : null);
      } else {
        reset({ firstName: "", lastName: "", email: "", phoneNumber: "", idProofNumber: "", nationality: "", dateOfBirth: "", address: "", emergencyContact: "" });
        setDocPreview(null);
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setDocPreview(base64);
        setValue("idProofNumber", base64);
        toast.success(`Attached ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? hotelService.updateGuest(itemToEdit.id, { ...data, email: data.email || "", phoneNumber: data.phoneNumber || "", dateOfBirth: data.dateOfBirth || undefined })
        : hotelService.createGuest({ ...data, email: data.email || "", phoneNumber: data.phoneNumber || "", dateOfBirth: data.dateOfBirth || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success(`Guest ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || `Failed to ${isEdit ? "update" : "create"}`;
      toast.error(msg);
    }
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Guest Profile" : "New Guest Profile"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <Info size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Fields marked with (<span className="text-red-500 font-bold">*</span>) are required. Email and contact formats are validated automatically.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                {...register("firstName")}
                placeholder="e.g. John"
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                {...register("lastName")}
                placeholder="e.g. Doe"
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                {...register("email")}
                placeholder="john.doe@email.com"
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input {...register("phoneNumber")} placeholder="e.g., +1 555-0199" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>

            {/* Passport / National ID Proof & Drag-and-Drop File Upload */}
            <div className="col-span-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Passport / National ID Verification
                </label>
                {docPreview && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <FileCheck size={14} /> Document Uploaded
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <input
                    type="text"
                    placeholder="ID / Passport # (e.g. N1234567)"
                    {...register("idProofNumber")}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="relative">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-xs">
                    <Upload size={14} /> Upload ID / Passport Scan
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              {docPreview && (
                <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black/5 flex items-center justify-center">
                  <img src={docPreview} alt="Passport Scan Preview" className="max-h-full object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationality</label>
              <input {...register("nationality")} placeholder="e.g. American, French" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <Datepicker 
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
              <input {...register("emergencyContact")} placeholder="e.g., +1 555-9999" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input {...register("address")} placeholder="Home Address" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
