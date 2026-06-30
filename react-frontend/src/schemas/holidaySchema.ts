import { z } from "zod";

export const holidaySchema = z.object({
  name: z.string().min(1, "Holiday name is required"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["Mandatory", "Corporate", "Optional"]),
  description: z.string().optional(),
});

export interface HolidayFormData extends z.infer<typeof holidaySchema> {}
