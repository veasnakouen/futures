import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalBody, Label, TextInput, Select } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { toast } from "react-hot-toast";

export interface TenantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantToEdit?: any;
  onSave?: (data: any) => Promise<void>;
  [key: string]: any;
}

export default function TenantFormModal({
  isOpen,
  onClose,
  tenantToEdit,
  onSave = async () => {},
}: TenantFormModalProps) {
  const isEdit = !!tenantToEdit;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  useEffect(() => {
    if (isOpen) {
      if (tenantToEdit) reset(tenantToEdit);
      else reset({ status: "ACTIVE", subscriptionPlan: "ENTERPRISE" });
    }
  }, [isOpen, tenantToEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
      toast.success(isEdit ? "Tenant updated" : "Tenant registered");
      onClose();
    } catch {
      toast.error("Failed to save tenant configuration");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="md" dismissible={false}>
      <CustomModalHeader
        title={isEdit ? "Modify Tenant Account" : "Provision Multi-Tenant Node"}
        subtitle="System Governance"
        onClose={onClose}
      />
      <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4 text-xs">
        <form id="tenant-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Tenant Name</Label>
            <TextInput {...register("name", { required: "Name is required" })} sizing="sm" placeholder="e.g. Royal Phnom Penh Hospital" />
            {errors.name && <p className="text-red-500 text-[10px]">{errors.name.message as string}</p>}
          </div>

          <div>
            <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Domain Key / Slug</Label>
            <TextInput {...register("domainKey", { required: "Domain key is required" })} sizing="sm" placeholder="royal-hospital" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Subscription Plan</Label>
              <Select {...register("subscriptionPlan")} sizing="sm">
                <option value="STARTER">Starter</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="ENTERPRISE">Enterprise</option>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Status</Label>
              <Select {...register("status")} sizing="sm">
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </Select>
            </div>
          </div>
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={isEdit}
        submitText={isEdit ? "Update Tenant" : "Provision Node"}
        formId="tenant-form"
      />
    </Modal>
  );
}
