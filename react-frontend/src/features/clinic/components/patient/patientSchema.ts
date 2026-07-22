import * as z from "zod";

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.string().min(1, "Gender is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  medicalRecordNumber: z.string().optional(),
  bloodType: z.string().optional(),
  poorId: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      commune: z.string().optional(),
      village: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  customAttributes: z.record(z.string(), z.any()).optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
