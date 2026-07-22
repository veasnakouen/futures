"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { clinicService, PatientDto } from "../../../services/clinicService";
import PillTabs from "@/components/common/PillTabs";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DynamicCustomFields, { CustomFieldDefinition } from "../../../components/common/DynamicCustomFields";
import { UserPlus } from "lucide-react";

import { patientFormSchema, PatientFormValues } from "./patient/patientSchema";
import { PatientPersonalInfoFields } from "./patient/PatientPersonalInfoFields";
import { PatientAddressFields } from "./patient/PatientAddressFields";

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

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({
          ...itemToEdit,
          address: itemToEdit.address || {
            street: "",
            city: "",
            district: "",
            commune: "",
            village: "",
            state: "",
            zipCode: "",
            country: "Cambodia",
          },
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
          poorId: "",
          address: {
            street: "",
            city: "",
            district: "",
            commune: "",
            village: "",
            state: "",
            zipCode: "",
            country: "Cambodia",
          },
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

  const onSubmit = (data: PatientFormValues) => {
    const payload = {
      ...data,
      customAttributes: data.customAttributes ? JSON.stringify(data.customAttributes) : undefined,
    };
    mutation.mutate(payload as any);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <CustomModalHeader
        title={isEdit ? "Edit Patient Record" : "New Patient Registration"}
        subtitle="Clinical Demographics & Health Profile"
        onClose={onClose}
        icon={<UserPlus size={20} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-0 bg-gray-50/50 dark:bg-gray-900/50">
          <PillTabs
            className="mx-6 mt-5"
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            tabs={[
              { id: "basic", label: "Patient Profile & Address" },
              ...(customFields && customFields.length > 0 ? [{ id: "custom", label: "Custom Attributes" }] : [])
            ]}
          />

          <div className="p-6 space-y-6">
            {activeTab === "basic" && (
              <>
                <PatientPersonalInfoFields register={register} errors={errors} control={control} />
                <PatientAddressFields register={register} watch={watch} setValue={setValue} />
              </>
            )}

            {activeTab === "custom" && customFields && customFields.length > 0 && (
              <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
                <DynamicCustomFields definitions={customFields} prefix="customAttributes." />
              </div>
            )}
          </div>
        </ModalBody>
        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Patient Record" : "Register Patient"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
