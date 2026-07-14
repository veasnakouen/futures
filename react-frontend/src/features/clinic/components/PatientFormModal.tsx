"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, PatientDto } from "../../../services/clinicService";
import PillTabs from "@/components/common/PillTabs";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import {Modal, ModalBody} from "@/lib/flowbite-compat";
import { useQuery } from "@tanstack/react-query";
import DynamicCustomFields, { CustomFieldDefinition } from "../../../components/common/DynamicCustomFields";
import { useState } from "react";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  contactNumber: z.string().min(1, "Required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  medicalRecordNumber: z.string().optional(),
  bloodType: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  customAttributes: z.record(z.string(), z.any()).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: PatientDto | null;
}

export default function PatientFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;
  const [activeTab, setActiveTab] = useState<"basic" | "custom">("basic");

  const { data: customFields } = useQuery<CustomFieldDefinition[]>({
    queryKey: ["customFields", "PATIENT"],
    queryFn: () => clinicService.getCustomFields("PATIENT").then(res => res.data),
    enabled: isOpen,
  });

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({
          ...itemToEdit,
          address: itemToEdit.address || { street: "", city: "", state: "", zipCode: "", country: "" },
          customAttributes: itemToEdit.customAttributes ? JSON.parse(itemToEdit.customAttributes) : {},
        });
      } else {
        reset({ 
          firstName: "", 
          lastName: "", 
          dateOfBirth: "", 
          gender: "MALE", 
          contactNumber: "",
          email: "",
          medicalRecordNumber: "",
          bloodType: "",
          address: { street: "", city: "", state: "", zipCode: "", country: "" },
          customAttributes: {},
        });
      }
      setActiveTab("basic");
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEdit && itemToEdit
        ? clinicService.updatePatient(itemToEdit.id, data)
        : clinicService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success(`Patient ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      customAttributes: data.customAttributes ? JSON.stringify(data.customAttributes) : undefined,
    };
    mutation.mutate(payload as any);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <CustomModalHeader title={isEdit ? "Edit Patient" : "New Patient"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-0">
          <PillTabs
            className="mx-4 mt-4"
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            tabs={[
              { id: "basic", label: "Basic Info" },
              ...(customFields && customFields.length > 0 ? [{ id: "custom", label: "Custom Fields" }] : [])
            ]}
          />
          
          <div className="p-6 space-y-4">
            {activeTab === "basic" && (
              <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input {...register("firstName")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input {...register("lastName")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medical Record No.</label>
              <input {...register("medicalRecordNumber")} placeholder="Optional / Auto-generated" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Type</label>
              <select {...register("bloodType")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Date of Birth"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(format(date, "yyyy-MM-dd"))}
                    placeholder="Select Date..."
                  />
                )}
              />
              {errors.dateOfBirth && <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select {...register("gender")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
              <input {...register("contactNumber")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.contactNumber && <span className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</span>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" {...register("email")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>
          </div>
          
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mt-6 mb-4">Address Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
              <input {...register("address.street")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input {...register("address.city")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
              <input {...register("address.state")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip / Postal Code</label>
              <input {...register("address.zipCode")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <input {...register("address.country")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
              </>
            )}

            {activeTab === "custom" && customFields && customFields.length > 0 && (
              <div className="space-y-4">
                <DynamicCustomFields definitions={customFields} prefix="customAttributes." />
              </div>
            )}
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
