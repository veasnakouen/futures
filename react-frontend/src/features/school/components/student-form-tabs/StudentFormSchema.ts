import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { CustomFieldDefinition } from "../../../../components/common/DynamicCustomFields";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().optional(),

  email: z.string().email("Invalid email").or(z.literal("")),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  studentIdNumber: z.string().optional(),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  gradeLevel: z.string().optional(),
  classroom: z.string().optional(),
  branchId: z.string().optional(),
  status: z.string().optional(),
  transportationRoute: z.string().optional(),
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
  form: UseFormReturn<FormValues | any>;
  t: (key: string) => string;
  register?: any;
  watch?: any;
  setValue?: any;
  errors?: any;
  clientsData?: any;
  clientsLoading?: boolean;
  handleClientSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  branchesData?: any;
  parentsData?: any;
  extracurricularsData?: any[];
  customFields?: CustomFieldDefinition[];
  usersData?: any[];
  usersLoading?: boolean;
  [key: string]: any;
}
