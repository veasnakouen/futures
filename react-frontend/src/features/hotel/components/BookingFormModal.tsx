"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { hotelService, BookingDto } from "../../../services/hotelService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import {Modal, ModalBody} from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";

const schema = z.object({
  guestId: z.string().min(1, "Required"),
  roomId: z.string().min(1, "Required"),
  checkInDate: z.string().min(1, "Required"),
  checkOutDate: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  totalAmount: z.coerce.number().min(0, "Invalid amount"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: BookingDto | null;
}

export default function BookingFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { data: guestsData } = useQuery({
    queryKey: ["guests", 0, 1000],
    queryFn: () => hotelService.getGuests(0, 1000).then(res => res.data),
  });
  const guests = guestsData?.content || [];

  const { data: roomsData } = useQuery({
    queryKey: ["rooms", 0, 1000],
    queryFn: () => hotelService.getRooms(0, 1000).then(res => res.data),
  });
  const rooms = roomsData?.content || [];

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ guestId: "", roomId: "", checkInDate: "", checkOutDate: "", status: "PENDING", totalAmount: 0 });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? hotelService.updateBooking(itemToEdit.id, data)
        : hotelService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(`Booking ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Booking" : "New Booking"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest</label>
              <select {...register("guestId")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Guest...</option>
                {guests.map((guest: any) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.firstName} {guest.lastName} ({guest.email})
                  </option>
                ))}
              </select>
              {errors.guestId && <p className="text-red-500 text-xs mt-1">{errors.guestId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room</label>
              <select {...register("roomId")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Room...</option>
                {rooms.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} - {room.roomType} (${room.pricePerNight})
                  </option>
                ))}
              </select>
              {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId.message}</p>}
            </div>
            <div>
              <Controller
                control={control}
                name="checkInDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Check-in"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="Select Date..."
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="checkOutDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Check-out"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="Select Date..."
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select {...register("status")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total ($)</label>
              <input type="number" step="0.01" {...register("totalAmount")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
