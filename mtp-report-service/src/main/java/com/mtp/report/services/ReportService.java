package com.mtp.report.services;

import com.mtp.report.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public Map<String, Object> getEmployeeEvaluationReport(Long departmentId, String status, String startDate,
            String endDate, int page, int size) {
        // Calculate offset
        int offset = page * size;

        // Fetch data
        List<Map<String, Object>> content = reportRepository.getEmployeeEvaluationReport(departmentId, status,
                startDate, endDate, offset, size);

        // Fetch total count
        long totalElements = reportRepository.countEmployeeEvaluations(departmentId, status, startDate, endDate);
        int totalPages = (int) Math.ceil((double) totalElements / size);

        // Build response matching standard page structure
        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);
        response.put("currentPage", page);
        response.put("size", size);

        return response;
    }

    public List<Map<String, Object>> getExportEmployeeEvaluationReport(Long departmentId, String status,
            String startDate, String endDate) {
        return reportRepository.getExportEmployeeEvaluationReport(departmentId, status, startDate, endDate);
    }
}
