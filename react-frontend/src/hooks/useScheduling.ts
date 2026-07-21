import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService, ShiftScheduleDto, BulkShiftScheduleDto, WeeklyScheduleDto } from "../services/scheduleService";
import { toast } from "react-hot-toast";

const getErrorMsg = (error: any, defaultMsg: string) => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
  }
  return defaultMsg;
};

export const useScheduling = () => {
  const queryClient = useQueryClient();

  const useYearSchedules = (year: number) => {
    return useQuery({
      queryKey: ["yearSchedules", year],
      queryFn: () => scheduleService.getYearSchedules(year),
    });
  };

  const useWeeklySchedules = () => {
    return useQuery({
      queryKey: ["weeklySchedules"],
      queryFn: () => scheduleService.getWeeklySchedules(),
    });
  };

  const useCreateSchedule = () => {
    return useMutation({
      mutationFn: (data: ShiftScheduleDto) => scheduleService.createSchedule(data),
      onSuccess: (_, variables) => {
        toast.success("Schedule assigned successfully");
        queryClient.invalidateQueries({ queryKey: ["yearSchedules", variables.scheduleYear] });
      },
      onError: (error: any) => {
        toast.error(getErrorMsg(error, "Failed to assign schedule"));
      },
    });
  };

  const useCreateDepartmentSchedule = () => {
    return useMutation({
      mutationFn: (data: BulkShiftScheduleDto) => scheduleService.createDepartmentSchedule(data),
      onSuccess: (_, variables) => {
        toast.success("Department schedule assigned successfully");
        queryClient.invalidateQueries({ queryKey: ["yearSchedules", variables.scheduleYear] });
      },
      onError: (error: any) => {
        toast.error(getErrorMsg(error, "Failed to assign department schedule"));
      },
    });
  };

  const useCreateWeeklySchedule = () => {
    return useMutation({
      mutationFn: (data: WeeklyScheduleDto) => scheduleService.createWeeklySchedule(data),
      onSuccess: () => {
        toast.success("Weekly schedule assigned successfully");
        // queryClient.invalidateQueries({ queryKey: ["weeklySchedules"] }); // Can add this later if we display them
      },
      onError: (error: any) => {
        toast.error(getErrorMsg(error, "Failed to assign weekly schedule"));
      },
    });
  };

  const useUpdateSchedule = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: ShiftScheduleDto }) =>
        scheduleService.updateSchedule(id, data),
      onSuccess: (_, variables) => {
        toast.success("Schedule updated successfully");
        queryClient.invalidateQueries({ queryKey: ["yearSchedules", variables.data.scheduleYear] });
      },
      onError: (error: any) => {
        toast.error(getErrorMsg(error, "Failed to update schedule"));
      },
    });
  };

  const useDeleteSchedule = (year: number) => {
    return useMutation({
      mutationFn: (id: number) => scheduleService.deleteSchedule(id),
      onSuccess: () => {
        toast.success("Schedule deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["yearSchedules", year] });
      },
      onError: (error: any) => {
        toast.error(getErrorMsg(error, "Failed to delete schedule"));
      },
    });
  };

  return {
    useYearSchedules,
    useWeeklySchedules,
    useCreateSchedule,
    useCreateDepartmentSchedule,
    useCreateWeeklySchedule,
    useUpdateSchedule,
    useDeleteSchedule,
  };
};
