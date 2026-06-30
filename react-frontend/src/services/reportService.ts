import api from "./api";

export interface ReportSettingDto {
  id: string;
  reportName: string;
  description: string;
  cronSchedule: string;
  isActive: boolean;
}

export interface ExternalDataSourceDto {
  id: string;
  sourceName: string;
  connectionUrl: string;
  sourceType: string;
}

export const reportService = {
  // --- Report Settings ---
  getReportSettings: (page = 0, size = 10) =>
    api.get(`/report/settings?page=${page}&size=${size}`),
  getReportSettingById: (id: string) => api.get(`/report/settings/${id}`),
  createReportSetting: (data: Omit<ReportSettingDto, "id">) =>
    api.post(`/report/settings`, data),
  updateReportSetting: (id: string, data: Omit<ReportSettingDto, "id">) =>
    api.put(`/report/settings/${id}`, data),
  deleteReportSetting: (id: string) => api.delete(`/report/settings/${id}`),

  // --- External Data Sources ---
  getExternalDataSources: (page = 0, size = 10) =>
    api.get(`/report/data-sources?page=${page}&size=${size}`),
  getExternalDataSourceById: (id: string) => api.get(`/report/data-sources/${id}`),
  createExternalDataSource: (data: Omit<ExternalDataSourceDto, "id">) =>
    api.post(`/report/data-sources`, data),
  updateExternalDataSource: (id: string, data: Omit<ExternalDataSourceDto, "id">) =>
    api.put(`/report/data-sources/${id}`, data),
};
