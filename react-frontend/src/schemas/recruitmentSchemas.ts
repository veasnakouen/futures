import { z } from "zod";

export const vacancySchema = z.object({
  employerId: z.string().min(1, "Employer is required"),
  jobPositionId: z.string().min(1, "Position is required"),
  positionAvailable: z.number().min(1, "At least 1 position must be available"),
  salary: z.string().min(1, "Salary is required"),
  salarymax: z.string().optional(),
  closingDate: z.string().min(1, "Closing date is required"),
  contractType: z.string().min(1, "Contract type is required"),
  status: z.string().min(1, "Status is required"),
  location: z.string().optional(),
  schedule: z.string().optional(),
  responsibilities: z.string().optional(),
  requirement: z.string().optional(),
  applicationInformation: z.string().optional(),
});

export const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  gender: z.string().min(1, "Gender is required"),
  contactPhone: z
    .string()
    .regex(/^(\+?[0-9\s\-\.\(\\)]{0,30})$/, "Invalid phone format")
    .min(1, "Phone is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  province: z.string().min(1, "Province is required"),
  clientCode: z.string().min(1, "Client code is required"),
  branch: z.string().min(1, "Branch is required"),
  status: z.string().min(1, "Status is required"),
  headline: z.string().optional(),
  desiredSalary: z.string().optional(),
  availability: z.string().optional(),
  preferredLocation: z.string().optional(),
  primarySkills: z.string().optional(),
});

export const placementSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobPositionId: z.string().min(1, "Position is required"),
  salary: z.number().min(0, "Salary cannot be negative"),
  placementDate: z.string().min(1, "Placement date is required"),
  placementType: z.string().min(1, "Placement type is required"),
  status: z.string().min(1, "Status is required"),
});

export const jobTipSchema = z.object({
  referrerCandidateId: z.string().min(1, "Referrer candidate is required"),
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  positionsCount: z.coerce.number().min(1, "At least 1 position required"),
  estimatedSalary: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export interface VacancyFormData extends z.infer<typeof vacancySchema> {}
export interface ClientFormData extends z.infer<typeof clientSchema> {}
export interface PlacementFormData extends z.infer<typeof placementSchema> {}
export interface JobTipFormData extends z.infer<typeof jobTipSchema> {}
