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
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import { Info, AlertCircle } from "lucide-react";

const schema = z.object({
  roomId: z.string().min(1, "Please select a room"),
  staffId: z.string().min(1, "Please select a staff member"),
  taskDate: z.string().min(1, "Task date is required"),
  status: z.string().min(1, "Status is required"),
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
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(`Task ${isEdit ? "updated" : "created"} successfully`);
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
      <CustomModalHeader title={isEdit ? "Edit Housekeeping Task" : "Assign Housekeeping Task"} onClose={onClose} icon={null} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-4">
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <Info size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Fields marked with (<span className="text-red-500 font-bold">*</span>) are required. Task dates & staff assignments are validated automatically.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room #{room.roomNumber} - {room.roomType}
                  </option>
                ))}
              </select>
              {errors.roomId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.roomId.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Staff <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                {...register("staffId")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border transition-colors ${
                  errors.staffId ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Staff...</option>
                {staffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>
              {errors.staffId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.staffId.message}
                </p>
              )}
            </div>
            <div>
              <Controller
                control={control}
                name="taskDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Task Date *"
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              {errors.taskDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.taskDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500 font-bold">*</span>
              </label>
              <select {...register("status")} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED (Restores Room to Clean)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Details & Notes</label>
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="e.g. Deep clean carpet, replace bedsheets, sanitize bathroom"
                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={isEdit ? "Save Changes" : "Assign Task"} submitDisabled={mutation.isPending} />
      </form>
    </Modal>
  );
}
