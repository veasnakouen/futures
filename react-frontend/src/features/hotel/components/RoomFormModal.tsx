"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, RoomDto } from "../../../services/hotelService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import { Info, AlertCircle } from "lucide-react";

const schema = z.object({
  roomNumber: z.string().min(1, "Room / Property number is required"),
  roomType: z.string().min(1, "Room type is required"),
  status: z.string().min(1, "Status is required"),
  pricePerNight: z.coerce.number().min(0, "Price per night cannot be negative"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1 guest").optional(),
  bedType: z.string().optional(),
  amenities: z.string().optional(),
  floorNumber: z.coerce.number().optional(),
  address: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: RoomDto | null;
}

export default function RoomFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ roomNumber: "", roomType: "STANDARD", status: "AVAILABLE", pricePerNight: 0, capacity: 2, bedType: "", amenities: "", floorNumber: 1, address: "", bedrooms: 1, bathrooms: 1 });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? hotelService.updateRoom(itemToEdit.id, data)
        : hotelService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(`Room ${isEdit ? "updated" : "created"} successfully`);
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
      <CustomModalHeader title={isEdit ? "Edit Accommodation" : "New Accommodation"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <Info size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Fields marked with (<span className="text-red-500 font-bold">*</span>) are required. Numerical rates & capacities are validated automatically.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room / Property # <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                {...register("roomNumber")}
                placeholder="e.g. 101 or Deluxe Villa A"
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.roomNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.roomNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.roomNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor #</label>
              <input type="number" placeholder="e.g. 2" {...register("floorNumber")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type <span className="text-red-500 font-bold">*</span>
              </label>
              <select {...register("roomType")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                <option value="STANDARD">STANDARD</option>
                <option value="DELUXE">DELUXE</option>
                <option value="SUITE">SUITE</option>
                <option value="HOUSE">HOUSE</option>
                <option value="VILLA">VILLA</option>
                <option value="APARTMENT">APARTMENT</option>
                <option value="FAN">FAN</option>
                <option value="AIR-CONDITIONER">AIR-CONDITIONER</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500 font-bold">*</span>
              </label>
              <select {...register("status")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="DIRTY">DIRTY (Needs Cleaning)</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price/Night ($) <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 150.00"
                {...register("pricePerNight")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.pricePerNight ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.pricePerNight && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.pricePerNight.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
              <input type="number" placeholder="Max Guests" {...register("capacity")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
              <input type="number" placeholder="Count" {...register("bedrooms")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms</label>
              <input type="number" step="0.5" placeholder="Count" {...register("bathrooms")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address (if applicable)</label>
              <input {...register("address")} placeholder="e.g., 123 Beachfront Ave, City, Country" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bed Type</label>
              <input {...register("bedType")} placeholder="e.g., 1 King Bed, 2 Queen Beds" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities</label>
              <input {...register("amenities")} placeholder="e.g., Wi-Fi, AC, Mini-fridge, Ocean View" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
