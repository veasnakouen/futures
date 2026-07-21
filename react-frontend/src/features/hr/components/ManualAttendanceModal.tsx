import React from "react";
import {Label, TextInput, Select, Button, Textarea} from '@/lib/flowbite-compat';
import { X, Clock, MapPin, User, FileText, Calendar } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  manualAttendanceSchema,
  type ManualAttendanceFormData,
} from '@/schemas/attendanceSchema';

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: any[];
  handleSubmit: (data: any) => void;
}

const ManualAttendanceModal: React.FC<ManualAttendanceModalProps> = ({
  isOpen,
  onClose,
  employees,
  handleSubmit,
}) => {
  const {
    register,
    handleSubmit: hookSubmit,
    control,
    formState: { errors },
  } = useForm<ManualAttendanceFormData>({
    resolver: zodResolver(manualAttendanceSchema),
    defaultValues: {
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      clockInTime: "08:00",
      clockOutTime: "17:00",
      status: "Present",
      location: "Central Office",
      note: "",
    },
  });

  const onFormSubmit = (data: ManualAttendanceFormData) => {
    // Combine date and time for LocalDateTime compatibility
    const clockIn = `${data.date}T${data.clockInTime}:00`;
    const clockOut = data.clockOutTime
      ? `${data.date}T${data.clockOutTime}:00`
      : null;

    handleSubmit({
      employeeId: parseInt(data.employeeId),
      clockIn,
      clockOut,
      status: data.status,
      location: data.location,
      note: data.note,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:left-[260px] z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-up flex flex-col">
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-md">
              <Clock size={20} />
            </div>
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
              Manual Attendance Log
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-800">
        <form
          id="manual-attendance-form"
          onSubmit={hookSubmit(onFormSubmit)}
          className="space-y-6"
        >
          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
              Select Staff Member
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                <User size={14} />
              </div>
              <Select {...register("employeeId")} className="pl-10">
                <option value="">Select Personnel...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstNameEnglish} {emp.lastNameEnglish} ({emp.idNo})
                  </option>
                ))}
              </Select>
              {errors.employeeId && (
                <p className="text-[10px] text-red-500 mt-1 font-bold">
                  {errors.employeeId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                Log Date
              </Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value) : new Date()}
                    onChange={(date) =>
                      field.onChange(format(date, "yyyy-MM-dd"))
                    }
                    placeholder="Select date..."
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                Attendance Status
              </Label>
              <Select {...register("status")}>
                <option>Present</option>
                <option>Late</option>
                <option>Early Leave</option>
                <option>Off-site</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                Clock In Time
              </Label>
              <TextInput type="time" {...register("clockInTime")} />
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                Clock Out Time
              </Label>
              <TextInput type="time" {...register("clockOutTime")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
              Work Location
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                <MapPin size={14} />
              </div>
              <TextInput
                placeholder="e.g. Central Office, Field Site A"
                {...register("location")}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
              Official Notes / Reason
            </Label>
            <Textarea
              placeholder="State the reason for manual log entry..."
              {...register("note")}
              rows={3}
            />
          </div>
        </form>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 px-6">
          <div className="flex gap-2 w-full justify-end">
            <Button
              color="gray"
              outline
              size="sm"
              onClick={onClose}
              className="rounded px-2"
            >
              Discard
            </Button>
            <Button
              color="blue"
              outline
              size="sm"
              type="submit"
              form="manual-attendance-form"
              className="flex-1 rounded uppercase tracking-wider font-bold"
            >
              Commit Log Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualAttendanceModal;
