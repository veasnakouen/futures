import api from "../api";

export const medicalRecordService = {
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
  createDiagnosisTemplate: (data: any) => api.post(`/clinic/diagnosis-templates`, data),

  // --- Custom Fields ---
  getCustomFields: (entityType: string) =>
    api.get(`/clinic/custom-fields?entityType=${entityType}`),

  // --- Dashboard ---
  getDashboardStats: () => api.get(`/clinic/dashboard/stats`),
  getDashboardChartData: () => api.get(`/clinic/dashboard/chart-data`),
};
