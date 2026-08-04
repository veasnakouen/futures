"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { hotelService, BookingDto } from "../../../services/hotelService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import { UserPlus, Info, AlertCircle } from "lucide-react";

const schema = z.object({
  guestId: z.string().min(1, "Please select a guest or create a new profile"),
  roomId: z.string().min(1, "Please select a room"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  status: z.string().min(1, "Status is required"),
  totalAmount: z.coerce.number().min(0, "Amount must be a non-negative number"),
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

  const [newGuestForm, setNewGuestForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  const selectedGuestId = watch("guestId");
  const selectedRoomId = watch("roomId");
  const checkIn = watch("checkInDate");
  const checkOut = watch("checkOutDate");

  const isNewGuestSelected = selectedGuestId === "NEW_GUEST";

  // Auto-calculate Total Amount based on Nights * Room.pricePerNight
  useEffect(() => {
    if (selectedRoomId && checkIn && checkOut) {
      const selectedRoom = rooms.find((r: any) => String(r.id) === String(selectedRoomId));
      if (selectedRoom) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          setValue("totalAmount", diffDays * (selectedRoom.pricePerNight || 0));
        }
      }
    }
  }, [selectedRoomId, checkIn, checkOut, rooms, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        reset({ guestId: "", roomId: "", checkInDate: "", checkOutDate: "", status: "PENDING", totalAmount: 0 });
        setNewGuestForm({ firstName: "", lastName: "", email: "", phone: "" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      let finalGuestId = data.guestId;

      // Handle Quick-Add New Guest creation seamlessly
      if (data.guestId === "NEW_GUEST") {
        if (!newGuestForm.firstName.trim() || !newGuestForm.lastName.trim()) {
          throw new Error("Guest First Name and Last Name are required");
        }
        const createdGuestRes = await hotelService.createGuest({
          firstName: newGuestForm.firstName,
          lastName: newGuestForm.lastName,
          email: newGuestForm.email || `${newGuestForm.firstName.toLowerCase()}.${newGuestForm.lastName.toLowerCase()}@guest.mtp`,
          phoneNumber: newGuestForm.phone || "000-000-0000",
        });
        const createdGuest = createdGuestRes.data || createdGuestRes;
        finalGuestId = String(createdGuest.id);
        queryClient.invalidateQueries({ queryKey: ["guests"] });
      }

      const payload = { ...data, guestId: finalGuestId };

      return isEdit && itemToEdit
        ? hotelService.updateBooking(itemToEdit.id, payload)
        : hotelService.createBooking(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(`Booking ${isEdit ? "updated" : "created"} successfully`);
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
      <CustomModalHeader title={isEdit ? "Edit Booking" : "New Booking"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          {/* Modal Validation Helper Info Banner */}
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <Info size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Fields marked with a red asterisk (<span className="text-red-500 font-bold">*</span>) are required. Pricing & dates are validated automatically.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guest <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                {...register("guestId")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.guestId ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Guest...</option>
                <option value="NEW_GUEST" className="font-semibold text-indigo-600 dark:text-indigo-400">
                  + Add New Guest...
                </option>
                {guests.map((guest: any) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.firstName} {guest.lastName} ({guest.email})
                  </option>
                ))}
              </select>
              {errors.guestId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.guestId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                {...register("roomId")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.roomId ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Room...</option>
                {rooms.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} - {room.roomType} (${room.pricePerNight})
                  </option>
                ))}
              </select>
              {errors.roomId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.roomId.message}
                </p>
              )}
            </div>

            {/* Quick-Add Guest Expanded Form Fields */}
            {isNewGuestSelected && (
              <div className="col-span-2 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                  <UserPlus size={16} /> Quick Register New Guest Profile
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      First Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John"
                      value={newGuestForm.firstName}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, firstName: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Last Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      value={newGuestForm.lastName}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, lastName: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="john.doe@email.com"
                      value={newGuestForm.email}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, email: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="+1 555-0199 (Digits)"
                      value={newGuestForm.phone}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Controller
                control={control}
                name="checkInDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Check-in *"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              {errors.checkInDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.checkInDate.message}
                </p>
              )}
            </div>

            <div>
              <Controller
                control={control}
                name="checkOutDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Check-out *"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              {errors.checkOutDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.checkOutDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total ($) <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00 (USD)"
                {...register("totalAmount")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.totalAmount ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              <p className="text-[10px] text-gray-400 mt-1">Auto-calculated from Room Rate × Nights</p>
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Create"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
