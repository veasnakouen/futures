"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hotelService, HousekeepingTaskDto, RoomDto } from "../../../services/hotelService";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import {Modal, ModalBody} from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";

const schema = z.object({
  roomId: z.string().min(1, "Required"),
  staffId: z.string().min(1, "Required"),
  taskDate: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: HousekeepingTaskDto | null;
}

export default function HousekeepingTaskFormModal({ isOpen, onClose, itemToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!itemToEdit;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({ ...itemToEdit });
      } else {
        const today = new Date().toISOString().split("T")[0];
        reset({ roomId: "", staffId: "", taskDate: today, status: "PENDING", notes: "" });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => hotelService.getRooms(0, 100).then((res) => res.data),
  });

  const { data: staffData } = useQuery({
    queryKey: ["staff"],
    queryFn: () => api.get("/employees?size=100").then((res) => res.data),
  });

  const rooms: RoomDto[] = roomsData?.content || [];
  const staffs: any[] = staffData?.content || [];

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && itemToEdit
        ? hotelService.updateHousekeepingTask(itemToEdit.id, { ...data, notes: data.notes || "" })
        : hotelService.createHousekeepingTask({ ...data, notes: data.notes || "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housekeeping"] });
      toast.success(`Task ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => toast.error(`Failed to ${isEdit ? "update" : "create"}`)
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title={isEdit ? "Edit Task" : "Assign Task"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room</label>
              <select {...register("roomId")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Room...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber} - {room.roomType}
                  </option>
                ))}
              </select>
              {errors.roomId && <span className="text-red-500 text-xs mt-1">{errors.roomId.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff</label>
              <select {...register("staffId")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select Staff...</option>
                {staffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>
              {errors.staffId && <span className="text-red-500 text-xs mt-1">{errors.staffId.message}</span>}
            </div>
            <div>
              <Controller
                control={control}
                name="taskDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Task Date"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="Select Date..."
                  />
                )}
              />
              {errors.taskDate && <span className="text-red-500 text-xs mt-1">{errors.taskDate.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select {...register("status")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea {...register("notes")} rows={2} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Assign Task"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
