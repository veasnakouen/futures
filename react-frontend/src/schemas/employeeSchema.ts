import { z } from "zod";

export const employeeSchema = z.object({
  firstNameEnglish: z.string().min(1, "First name is required").max(100),
  lastNameEnglish: z.string().min(1, "Last name is required").max(100),
  firstNameKhmer: z.string().optional(),
  lastNameKhmer: z.string().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  idNo: z.string().min(1, "Employee ID is required"),
  title: z.string().min(1, "Title is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^(\+?[0-9\s\-\.\(\\\)]{0,30})$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  joinDate: z.string().optional(),
  contractType: z.string().min(1, "Contract type is required"),
  status: z.string().min(1, "Status is required"),
  basicSalary: z.number().min(0, "Salary cannot be negative"),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z
    .string()
    .regex(/^(\+?[0-9\s\-\.\(\\\)]{0,30})$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  photo: z.string().optional(),
  // Extended personal fields (matching legacy system)
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  placeOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  children: z.string().optional(),
  identityCardType: z.string().optional(),
  identityCardNumber: z.string().optional(),
  // Employment fields
  manager: z.string().optional(),
  note: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  probationEndDate: z.string().optional(),
  // Biometric fields
  biometricStatus: z.string().optional(),
  biometricId: z.string().optional(),
  // Custom fields
  customFields: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  legacyPreviousPosition: z.string().optional(),
  legacyEducation: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        year: z.string(),
      }),
    )
    .optional(),
  legacyWorkExperience: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        duration: z.string(),
        description: z.string(),
      }),
    )
    .optional(),

  // Attachments
  photoIdAttachment: z.string().optional(),
  contractAttachment: z.string().optional(),
  idPoorAttachment: z.string().optional(),
  cvAttachment: z.string().optional(),
});

export interface EmployeeFormData extends z.infer<typeof employeeSchema> {}
