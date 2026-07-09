import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { CustomFieldDefinition } from "../../../../components/common/DynamicCustomFields";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),

  middleName: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  studentPhone: z.string().optional(),
  currentAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    district: z.string().optional(),
    commune: z.string().optional(),
    village: z.string().optional(),
  }).optional(),
  permanentAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    district: z.string().optional(),
    commune: z.string().optional(),
    village: z.string().optional(),
  }).optional(),
  studentCode: z.string().optional(),
  branchId: z.string().optional(),
  classroomId: z.string().optional(),
  dormitoryId: z.string().optional(),

  medicalConditions: z.string().optional(),
  clinicPatientId: z.string().optional(),
  parentRelationships: z.array(z.object({ parentId: z.string(), relationshipType: z.string() })).optional(),
  extracurricularIds: z.array(z.string()).optional(),
  customAttributes: z.record(z.string(), z.any()).optional(),
  imageUrl: z.string().optional(),

  isIdPoor: z.boolean().optional(),
  idPoorNumber: z.string().optional(),
  broughtByOutreachWorker: z.boolean().optional(),
  outreachWorkerName: z.string().optional(),
  outreachOrganization: z.string().optional(),
  globalClientId: z.number().optional(),
});

export type FormValues = z.infer<typeof studentSchema>;

export interface StudentFormTabProps {
  form: UseFormReturn<FormValues>;
  t: (key: string) => string;
  clientsData?: any;
  clientsLoading?: boolean;
  handleClientSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  branchesData?: any;
  parentsData?: any;
  extracurricularsData?: any[];
  customFields?: CustomFieldDefinition[];
  usersData?: any[];
  usersLoading?: boolean;
}
