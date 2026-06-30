import { z } from "zod";

export const manualAttendanceSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  date: z.string().min(1, "Date is required"),
  clockInTime: z.string().min(1, "Clock in time is required"),
  clockOutTime: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  location: z.string().min(1, "Location is required"),
  note: z.string().optional(),
});

export type ManualAttendanceFormData = z.infer<typeof manualAttendanceSchema>;
