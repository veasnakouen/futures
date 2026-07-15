import api from "./api";

// DTO Interfaces
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
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
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

// Service Methods
export const clinicService = {
  // --- Prescriptions ---
  getPrescriptions: (page = 0, size = 10) =>
    api.get(`/clinic/prescriptions?page=${page}&size=${size}`),
  getPrescriptionById: (id: string) => api.get(`/clinic/prescriptions/${id}`),
  getPrescriptionsByPatient: (patientId: string) =>
    api.get(`/clinic/prescriptions/patient/${patientId}`),
  createPrescription: (data: CreatePrescriptionCommand) =>
    api.post(`/clinic/prescriptions`, data),
  updatePrescription: (id: string, data: UpdatePrescriptionCommand) =>
    api.put(`/clinic/prescriptions/${id}`, data),
  deletePrescription: (id: string) => api.delete(`/clinic/prescriptions/${id}`),

  // --- Lab Orders ---
  getLabOrders: (page = 0, size = 10) =>
    api.get(`/clinic/lab-orders?page=${page}&size=${size}`),
  getLabOrderById: (id: string) => api.get(`/clinic/lab-orders/${id}`),
  createLabOrder: (data: CreateLabOrderCommand) =>
    api.post(`/clinic/lab-orders`, data),
  updateLabOrder: (id: string, data: UpdateLabOrderCommand) =>
    api.put(`/clinic/lab-orders/${id}`, data),
  deleteLabOrder: (id: string) => api.delete(`/clinic/lab-orders/${id}`),

  // --- Patients ---
  getPatients: (page = 0, size = 10) =>
    api.get(`/clinic/patients?page=${page}&size=${size}`),
  getPatientById: (id: string) => api.get(`/clinic/patients/${id}`),
  createPatient: (data: any) => api.post(`/clinic/patients`, data),
  updatePatient: (id: string, data: any) => api.put(`/clinic/patients/${id}`, data),
  deletePatient: (id: string) => api.delete(`/clinic/patients/${id}`),

  // --- Appointments ---
  getAppointments: (page = 0, size = 10) =>
    api.get(`/clinic/appointments?page=${page}&size=${size}`),
  getAppointmentById: (id: string) => api.get(`/clinic/appointments/${id}`),
  createAppointment: (data: any) => api.post(`/clinic/appointments`, data),
  updateAppointment: (id: string, data: any) => api.put(`/clinic/appointments/${id}`, data),
  deleteAppointment: (id: string) => api.delete(`/clinic/appointments/${id}`),

  // --- Doctors ---
  getDoctors: (page = 0, size = 10) =>
    api.get(`/clinic/doctors?page=${page}&size=${size}`),
  getDoctorById: (id: string) => api.get(`/clinic/doctors/${id}`),
  createDoctor: (data: any) => api.post(`/clinic/doctors`, data),
  updateDoctor: (id: string, data: any) => api.put(`/clinic/doctors/${id}`, data),
  deleteDoctor: (id: string) => api.delete(`/clinic/doctors/${id}`),

  // --- Medical Records ---
  getMedicalRecords: (page = 0, size = 10) =>
    api.get(`/clinic/records?page=${page}&size=${size}`),
  getMedicalRecordById: (id: string) => api.get(`/clinic/records/${id}`),
  getMedicalRecordsByPatient: (patientId: string, page = 0, size = 10) =>
    api.get(`/clinic/records/patient/${patientId}?page=${page}&size=${size}`),
  getTodayMedicalRecords: (page = 0, size = 100) =>
    api.get(`/clinic/records/today?page=${page}&size=${size}`),
  createMedicalRecord: (data: any) => api.post(`/clinic/records`, data),
  updateMedicalRecord: (id: string, data: any) => api.put(`/clinic/records/${id}`, data),
  deleteMedicalRecord: (id: string) => api.delete(`/clinic/records/${id}`),

  // --- Diagnosis Templates ---
  getDiagnosisTemplates: (page = 0, size = 100) =>
    api.get(`/clinic/diagnosis-templates?page=${page}&size=${size}`),
  createDiagnosisTemplate: (data: any) => 
    api.post(`/clinic/diagnosis-templates`, data),

  // --- Custom Fields ---
  getCustomFields: (entityType: string) => 
    api.get(`/clinic/custom-fields?entityType=${entityType}`),

  // --- Dashboard ---
  getDashboardStats: () => api.get(`/clinic/dashboard/stats`),
  getDashboardChartData: () => api.get(`/clinic/dashboard/chart-data`),
};

