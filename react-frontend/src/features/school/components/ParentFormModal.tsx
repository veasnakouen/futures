"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService, ParentDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.object({
    street: z.string().optional(),
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
  parentToEdit?: ParentDto | null;
}

export default function ParentFormModal({ isOpen, onClose, parentToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!parentToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (parentToEdit) {
        reset({
          name: parentToEdit.name,
          contactNumber: parentToEdit.contactNumber,
          email: parentToEdit.email || "",
          gender: (parentToEdit.gender as any) || "MALE",
          address: parentToEdit.address || {},
        });
      } else {
        reset({
          name: "",
          contactNumber: "",
          email: "",
          gender: "MALE",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        });
      }
    }
  }, [isOpen, parentToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && parentToEdit
        ? schoolService.updateParent(parentToEdit.id, data)
        : schoolService.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      toast.success(`Parent ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} parent`);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title={isEdit ? "Edit Parent" : "New Parent"}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Doe"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Number
            </label>
            <input
              {...register("contactNumber")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="+1 234 567 8900"
            />
            {errors.contactNumber && (
              <span className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="jane@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Address</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street
                </label>
                <input
                  {...register("address.street")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    {...register("address.city")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    {...register("address.state")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zip Code
                  </label>
                  <input
                    {...register("address.zipCode")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    {...register("address.country")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Changes" : "Create Parent"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
