import api from "./api";

export interface ShiftScheduleDto {
  id?: number;
  employeeId: string;
  employeeName?: string;
  scheduleYear: number;
  janShift?: string;
  febShift?: string;
  marShift?: string;
  aprShift?: string;
  mayShift?: string;
  junShift?: string;
  julShift?: string;
  augShift?: string;
  sepShift?: string;
  octShift?: string;
  novShift?: string;
  decShift?: string;
}

export interface BulkShiftScheduleDto {
  departmentId: number;
  scheduleYear: number;
  janShift?: string;
  febShift?: string;
  marShift?: string;
  aprShift?: string;
  mayShift?: string;
  junShift?: string;
  julShift?: string;
  augShift?: string;
  sepShift?: string;
  octShift?: string;
  novShift?: string;
  decShift?: string;
}

export interface WeeklyScheduleDto {
  id?: number;
  employeeId?: string; // idNo
  employeeName?: string;
  departmentId?: number;
  weekStartDate: string;
  mondayShift?: string;
  tuesdayShift?: string;
  wednesdayShift?: string;
  thursdayShift?: string;
  fridayShift?: string;
  saturdayShift?: string;
  sundayShift?: string;
}

export const scheduleService = {
  getYearSchedules: async (year: number): Promise<ShiftScheduleDto[]> => {
    const response = await api.get(`/v1/hr/scheduling/year/${year}`);
    return response.data;
  },

  getWeeklySchedules: async (): Promise<WeeklyScheduleDto[]> => {
    const response = await api.get(`/v1/hr/weekly-scheduling`);
    return response.data;
  },

  createSchedule: async (data: ShiftScheduleDto): Promise<ShiftScheduleDto> => {
    const response = await api.post("/v1/hr/scheduling", data);
    return response.data;
  },

  createDepartmentSchedule: async (data: BulkShiftScheduleDto): Promise<ShiftScheduleDto[]> => {
    const response = await api.post("/v1/hr/scheduling/department", data);
    return response.data;
  },

  updateSchedule: async (id: number, data: ShiftScheduleDto): Promise<ShiftScheduleDto> => {
    const response = await api.put(`/v1/hr/scheduling/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await api.delete(`/v1/hr/scheduling/${id}`);
  },

  createWeeklySchedule: async (data: WeeklyScheduleDto): Promise<any> => {
    const response = await api.post("/v1/hr/weekly-scheduling", data);
    return response.data;
  },
};
