import type {
  DoctorDto,
  PatientDto,
  AppointmentDto,
  PrescriptionDto,
  LabOrderDto,
} from "./clinicTypes";

const DOCTORS_STORAGE_KEY = "mtp_clinic_local_doctors";
const PATIENTS_STORAGE_KEY = "mtp_clinic_local_patients";
const APPOINTMENTS_STORAGE_KEY = "mtp_clinic_local_appointments";
const PRESCRIPTIONS_STORAGE_KEY = "mtp_clinic_local_prescriptions";
const LAB_ORDERS_STORAGE_KEY = "mtp_clinic_local_lab_orders";

export const getStoredDoctors = (): DoctorDto[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DOCTORS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredDoctors = (docs: DoctorDto[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error("Failed to save doctors to localStorage", e);
  }
};

export const getStoredPatients = (): PatientDto[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PATIENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredPatients = (patients: PatientDto[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error("Failed to save patients to localStorage", e);
  }
};

export const getStoredAppointments = (): AppointmentDto[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredAppointments = (appts: AppointmentDto[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appts));
  } catch (e) {
    console.error("Failed to save appointments to localStorage", e);
  }
};

export const getStoredPrescriptions = (): PrescriptionDto[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredPrescriptions = (items: PrescriptionDto[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save prescriptions to localStorage", e);
  }
};

export const getStoredLabOrders = (): LabOrderDto[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LAB_ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredLabOrders = (items: LabOrderDto[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAB_ORDERS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save lab orders to localStorage", e);
  }
};
