"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, TeacherDto, BranchDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import AddressFields from "../../../components/common/AddressFields";
import ImageUploadField from "../../../components/common/ImageUploadField";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  hireDate: z.string().min(1, "Hire date is required"),
  baseSalary: z.number().min(0, "Base salary must be positive").optional(),
  branchId: z.string().optional(),
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
  teacherToEdit?: TeacherDto | null;
}

export default function TeacherFormModal({ isOpen, onClose, teacherToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!teacherToEdit;
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

  const { data: branches = [] } = useQuery<BranchDto[]>({
    queryKey: ["branches"],
    queryFn: () => schoolService.getBranches().then((res) => res.data),
  });

  const hireDate = watch("hireDate");

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) {
        reset({
          firstName: teacherToEdit.firstName,
          lastName: teacherToEdit.lastName,
          email: teacherToEdit.email,
          subject: teacherToEdit.subject || "",
          hireDate: teacherToEdit.hireDate,
          baseSalary: teacherToEdit.baseSalary || 0,
          branchId: teacherToEdit.branchId || "",
          address: teacherToEdit.address || {},
          imageUrl: teacherToEdit.imageUrl || "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          hireDate: format(new Date(), "yyyy-MM-dd"),
          baseSalary: 0,
          branchId: "",
          address: {},
          imageUrl: "",
        });
      }
    }
  }, [isOpen, teacherToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && teacherToEdit
        ? schoolService.updateTeacher(teacherToEdit.id, data)
        : schoolService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(isEdit ? t("teacherUpdatedSuccess") : t("teacherCreatedSuccess"));
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? t("teacherUpdatedFail") : t("teacherCreatedFail"));
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = { ...data };
    if (payload.branchId === "") {
      delete payload.branchId;
    }
    mutation.mutate(payload);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? t("editTeacher") : t("newTeacher")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div className="flex justify-center mb-6">
            <ImageUploadField
              label=""
              isAvatar={true}
              value={watch("imageUrl")}
              onChange={(url) => setValue("imageUrl", url)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("firstName")}
              </label>
              <input
                {...register("firstName")}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Jane"
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("lastName")}
              </label>
              <input
                {...register("lastName")}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Smith"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("emailAddress")}
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="jane.smith@example.com"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("subject")}
              </label>
              <select
                {...register("subject")}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("selectSubject")}</option>
                <option value="Mathematics">{t("mathematics")}</option>
                <option value="Science">{t("science")}</option>
                <option value="English">{t("english")}</option>
                <option value="History">{t("history")}</option>
                <option value="Art">{t("art")}</option>
                <option value="Music">{t("music")}</option>
                <option value="Physical Education">{t("physicalEducation")}</option>
                <option value="Computer Science">{t("computerScience")}</option>
              </select>
              {errors.subject && (
                <span className="text-red-500 text-xs mt-1">{errors.subject.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("hireDate")}
              </label>
              <DatePicker
                value={hireDate ? new Date(hireDate) : null}
                onChange={(date) => setValue("hireDate", format(date, "yyyy-MM-dd"))}
                placeholder="Select Date"
              />
              {errors.hireDate && (
                <span className="text-red-500 text-xs mt-1">{errors.hireDate.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("baseSalary")}
              </label>
              <input
                type="number"
                {...register("baseSalary", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("branch")}
              </label>
              <select
                {...register("branchId")}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("selectBranch")}</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AddressFields<FormValues> register={register} errors={errors} prefix="address" watch={watch} setValue={setValue} />
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createTeacher")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
