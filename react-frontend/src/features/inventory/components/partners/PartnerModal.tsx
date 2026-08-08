import React, { useEffect } from "react";
import { Label, TextInput, Modal, ModalBody, Select } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";

interface PartnerFormData {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
  status: string;
  contactInfo?: string;
}

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  partnerType: "supplier" | "retailer" | "customer";
  defaultValues?: PartnerFormData | null;
  onSubmit: (data: PartnerFormData) => Promise<void>;
}

const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  partnerType,
  defaultValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormData>({
    defaultValues: defaultValues || {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      taxId: "",
      status: "ACTIVE",
      contactInfo: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset({ ...defaultValues, status: defaultValues.status || "ACTIVE" });
      } else {
        reset({
          name: "",
          contactPerson: "",
          phone: "",
          email: "",
          address: "",
          taxId: "",
          status: "ACTIVE",
          contactInfo: "",
        });
      }
    }
  }, [isOpen, defaultValues, reset]);

  const handleFormSubmit = async (data: PartnerFormData) => {
    await onSubmit(data);
    onClose();
  };

  const getTitle = () => {
    const typeLabel =
      partnerType === "supplier"
        ? "Supplier"
        : partnerType === "retailer"
          ? "Retailer / Vendor"
          : "Customer";
    return isEditMode ? `Edit ${typeLabel}` : `Add New ${typeLabel}`;
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl" popup>
      <CustomModalHeader
        title={getTitle()}
        subtitle="Manage Partner Network"
        onClose={onClose}
      />
      <ModalBody className="bg-white dark:bg-gray-800 p-6 rounded-b-2xl">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-xs font-bold mb-1 block">
                Organization Name *
              </Label>
              <TextInput
                id="name"
                placeholder="e.g. Acme Corp"
                {...register("name", { required: "Name is required" })}
                color={errors.name ? "failure" : "gray"}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="text-xs font-bold mb-1 block">
                Status
              </Label>
              <Select id="status" {...register("status")}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="contactPerson" className="text-xs font-bold mb-1 block">
                Contact Person
              </Label>
              <TextInput
                id="contactPerson"
                placeholder="e.g. Jane Doe"
                {...register("contactPerson")}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs font-bold mb-1 block">
                Phone Number
              </Label>
              <TextInput
                id="phone"
                placeholder="+1 (555) 123-4567"
                {...register("phone")}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold mb-1 block">
                Email Address
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="contact@company.com"
                {...register("email")}
              />
            </div>

            <div>
              <Label htmlFor="taxId" className="text-xs font-bold mb-1 block">
                Tax ID / VAT
              </Label>
              <TextInput
                id="taxId"
                placeholder="e.g. US-123456789"
                {...register("taxId")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-xs font-bold mb-1 block">
              Physical Address
            </Label>
            <TextInput
              id="address"
              placeholder="123 Business St, Suite 100, City, Country"
              {...register("address")}
            />
          </div>

          <div>
            <Label htmlFor="contactInfo" className="text-xs font-bold mb-1 block">
              Internal Notes / Additional Info
            </Label>
            <TextInput
              id="contactInfo"
              placeholder="Any additional remarks..."
              {...register("contactInfo")}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? "Saving..." : "Save Partner"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default PartnerModal;
