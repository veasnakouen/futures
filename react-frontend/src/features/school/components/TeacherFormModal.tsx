"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, TeacherDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import AddressFields from "../../../components/common/AddressFields";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
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

  const hireDate = watch("hireDate");

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) {
        reset({
          firstName: teacherToEdit.firstName,
          lastName: teacherToEdit.lastName,
          email: teacherToEdit.email,
          department: teacherToEdit.department,
          hireDate: teacherToEdit.hireDate,
          baseSalary: teacherToEdit.baseSalary || 0,
          branchId: teacherToEdit.branchId || "",
          address: teacherToEdit.address || {},
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          department: "",
          hireDate: format(new Date(), "yyyy-MM-dd"),
          baseSalary: 0,
          branchId: "",
          address: {},
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
      toast.success(`Teacher ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} teacher`);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? "Edit Teacher" : "New Teacher"}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                {...register("firstName")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Jane"
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                {...register("lastName")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Smith"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="jane.smith@example.com"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                {...register("department")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Mathematics"
              />
              {errors.department && (
                <span className="text-red-500 text-xs mt-1">{errors.department.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hire Date
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
                Base Salary
              </label>
              <input
                type="number"
                {...register("baseSalary", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Branch ID
              </label>
              <input
                {...register("branchId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Branch ID"
              />
            </div>
          </div>

          <AddressFields<FormValues> register={register} errors={errors} prefix="address" watch={watch} setValue={setValue} />
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Changes" : "Create Teacher"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
