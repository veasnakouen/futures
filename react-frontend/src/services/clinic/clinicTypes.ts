export interface PrescriptionItemDto {
  id?: string;
  drugName: string;
  ndcCode: string;
  dosage: string;
  frequency: string;
  duration: string;
  refillsAllowed: string;
  phamacyId: string;
}

export interface PrescriptionDto {
  id: string;
  patientId: string;
  diagnosis: string;
  items: PrescriptionItemDto[];
}

export interface CreatePrescriptionCommand {
  patientId: string;
  diagnosis: string;
  items: PrescriptionItemDto[];
}

export interface UpdatePrescriptionCommand extends CreatePrescriptionCommand {}

export interface LabOrderDto {
  id: string;
  testName: string;
  loincCode: string;
  status: string;
  resultValue: string;
  referenceRange: string;
  abnormalFlag: string;
}

export interface CreateLabOrderCommand {
  testName: string;
  loincCode: string;
  status: string;
  resultValue: string;
  referenceRange: string;
  abnormalFlag: string;
}

export interface UpdateLabOrderCommand extends CreateLabOrderCommand {}

export interface PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email?: string;
  medicalRecordNumber?: string;
  poorId?: string;
  bloodType?: string;
  address?: {
    street?: string;
    village?: string;
    commune?: string;
    district?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  customAttributes?: string;
}

export interface AppointmentDto {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
}

export interface DoctorDto {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  contactNumber: string;
  email: string;
  licenseNumber?: string;
  yearOfExperience?: number;
  npiNumber?: string;
  consultationFee?: number;
  employeeId?: string;
  role?: string;
  hiredDate?: string;
  terminationDate?: string;
  shift?: string;
  photoUrl?: string;
  avatarUrl?: string;
}

export interface MedicalRecordDto {
  id: string;
  patientId: string;
  doctorId: string;
  recordDate: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
}
