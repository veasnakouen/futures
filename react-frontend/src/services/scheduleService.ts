import api from "./api";

export interface ShiftScheduleDto {
  id?: number;
  employeeId: string;
  employeeName?: string;
  weekStartDate: string; // YYYY-MM-DD
  mondayShift?: string;
  tuesdayShift?: string;
  wednesdayShift?: string;
  thursdayShift?: string;
  fridayShift?: string;
  saturdayShift?: string;
  sundayShift?: string;
}

export interface BulkShiftScheduleDto {
  departmentId: number;
  weekStartDate: string; // YYYY-MM-DD
  mondayShift?: string;
  tuesdayShift?: string;
  wednesdayShift?: string;
  thursdayShift?: string;
  fridayShift?: string;
  saturdayShift?: string;
  sundayShift?: string;
}

export const scheduleService = {
  getCurrentWeekSchedules: async (): Promise<ShiftScheduleDto[]> => {
    const response = await api.get("/hr/scheduling/current");
    return response.data;
  },

  createSchedule: async (data: ShiftScheduleDto): Promise<ShiftScheduleDto> => {
    const response = await api.post("/hr/scheduling", data);
    return response.data;
  },

  createDepartmentSchedule: async (data: BulkShiftScheduleDto): Promise<ShiftScheduleDto[]> => {
    const response = await api.post("/hr/scheduling/department", data);
    return response.data;
  },

  updateSchedule: async (id: number, data: ShiftScheduleDto): Promise<ShiftScheduleDto> => {
    const response = await api.put(`/hr/scheduling/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await api.delete(`/hr/scheduling/${id}`);
  },
};
