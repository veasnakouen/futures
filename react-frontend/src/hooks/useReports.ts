import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService, ReportSettingDto, ExternalDataSourceDto } from "../services/reportService";

export const useReportSettings = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["report-settings", page, size],
    queryFn: () => reportService.getReportSettings(page, size).then((res) => res.data),
  });
};

export const useExternalDataSources = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["report-data-sources", page, size],
    queryFn: () => reportService.getExternalDataSources(page, size).then((res) => res.data),
  });
};
