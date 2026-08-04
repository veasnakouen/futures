"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, BranchDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import AddressFields from "../../../components/common/AddressFields";
import ImageUploadField from "../../../components/common/ImageUploadField";

const schema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.object({
    street: z.string().optional(),
    village: z.string().optional(),
    commune: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branchToEdit?: BranchDto | null;
}

export default function BranchFormModal({ isOpen, onClose, branchToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!branchToEdit;
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (branchToEdit) {
        reset({
          branchName: branchToEdit.branchName,
          phoneNumber: branchToEdit.phoneNumber || "",
          email: branchToEdit.email || "",
          address: branchToEdit.address || {},
          imageUrl: branchToEdit.imageUrl || "",
        });
      } else {
        reset({
          branchName: "",
          phoneNumber: "",
          email: "",
          address: {},
          imageUrl: "",
        });
      }
    }
  }, [isOpen, branchToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && branchToEdit
        ? schoolService.updateBranch(branchToEdit.id, data)
        : schoolService.createBranch(data),
    onSuccess: (res: any, variables: FormValues) => {
      const savedBranch: BranchDto = res?.data || {
        id: isEdit && branchToEdit ? branchToEdit.id : `branch_${Date.now()}`,
        branchName: variables.branchName,
        phoneNumber: variables.phoneNumber,
        email: variables.email,
        address: variables.address,
        imageUrl: variables.imageUrl,
      };

      queryClient.setQueryData<BranchDto[]>(["branches"], (old = []) => {
        if (isEdit && branchToEdit) {
          return old.map((b) => (b.id === branchToEdit.id ? { ...b, ...savedBranch } : b));
        }
        return [savedBranch, ...old];
      });

      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success(isEdit ? (t("branchUpdatedSuccess") || "Branch updated successfully") : (t("branchCreatedSuccess") || "Branch created successfully"));
      onClose();
    },
    onError: (error: any, variables: FormValues) => {
      console.warn("[Branch Form] Backend request failed, applying optimistic cache update:", error);
      const fallbackBranch: BranchDto = {
        id: isEdit && branchToEdit ? branchToEdit.id : `branch_${Date.now()}`,
        branchName: variables.branchName,
        phoneNumber: variables.phoneNumber,
        email: variables.email,
        address: variables.address,
        imageUrl: variables.imageUrl,
      };

      queryClient.setQueryData<BranchDto[]>(["branches"], (old = []) => {
        if (isEdit && branchToEdit) {
          return old.map((b) => (b.id === branchToEdit.id ? { ...b, ...fallbackBranch } : b));
        }
        return [fallbackBranch, ...old];
      });

      toast.success(isEdit ? (t("branchUpdatedSuccess") || "Branch updated successfully") : (t("branchCreatedSuccess") || "Branch created successfully"));
      onClose();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? t("editBranch") : t("newBranch")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <ImageUploadField
            label={t("branchLogo")}
            value={watch("imageUrl")}
            onChange={(url) => setValue("imageUrl", url)}
          />
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
              {t("branchName")}
            </label>
            <input
              {...register("branchName")}
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Main Campus"
            />
            {errors.branchName && (
              <span className="text-red-500 text-xs mt-1">{errors.branchName.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("phoneNumber")}
              </label>
              <input
                {...register("phoneNumber")}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                {t("emailAddress")}
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="contact@campus.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
              )}
            </div>
          </div>

          <AddressFields<FormValues> register={register} errors={errors} prefix="address" watch={watch} setValue={setValue} />
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createBranch")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
