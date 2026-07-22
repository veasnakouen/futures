import * as z from "zod";

export const doctorFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  contactNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  licenseNumber: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  yearOfExperience: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || isNaN(Number(val)) ? undefined : Number(val)),
    z.number().optional()
  ),
  npiNumber: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  consultationFee: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || isNaN(Number(val)) ? undefined : Number(val)),
    z.number().optional()
  ),
  employeeId: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  role: z.string().min(1, "Role is required"),
  hiredDate: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  terminationDate: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  shift: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
