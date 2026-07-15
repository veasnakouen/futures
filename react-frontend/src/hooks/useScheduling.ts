import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService, ShiftScheduleDto, BulkShiftScheduleDto } from "../services/scheduleService";
import { toast } from "react-hot-toast";

export const useScheduling = () => {
  const queryClient = useQueryClient();

  const useCurrentWeekSchedules = () => {
    return useQuery({
      queryKey: ["currentWeekSchedules"],
      queryFn: scheduleService.getCurrentWeekSchedules,
    });
  };

  const useCreateSchedule = () => {
    return useMutation({
      mutationFn: (data: ShiftScheduleDto) => scheduleService.createSchedule(data),
      onSuccess: () => {
        toast.success("Schedule assigned successfully");
        queryClient.invalidateQueries({ queryKey: ["currentWeekSchedules"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data || "Failed to assign schedule");
      },
    });
  };

  const useCreateDepartmentSchedule = () => {
    return useMutation({
      mutationFn: (data: BulkShiftScheduleDto) => scheduleService.createDepartmentSchedule(data),
      onSuccess: () => {
        toast.success("Department schedule assigned successfully");
        queryClient.invalidateQueries({ queryKey: ["currentWeekSchedules"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data || "Failed to assign department schedule");
      },
    });
  };

  const useUpdateSchedule = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: ShiftScheduleDto }) =>
        scheduleService.updateSchedule(id, data),
      onSuccess: () => {
        toast.success("Schedule updated successfully");
        queryClient.invalidateQueries({ queryKey: ["currentWeekSchedules"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data || "Failed to update schedule");
      },
    });
  };

  const useDeleteSchedule = () => {
    return useMutation({
      mutationFn: (id: number) => scheduleService.deleteSchedule(id),
      onSuccess: () => {
        toast.success("Schedule deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["currentWeekSchedules"] });
      },
      onError: (error: any) => {
        toast.error("Failed to delete schedule");
      },
    });
  };

  return {
    useCurrentWeekSchedules,
    useCreateSchedule,
    useCreateDepartmentSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
  };
};
