package com.mtp.report.controllers;

import com.mtp.report.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/report-builder")
public class ReportBuilderController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Report Builder Service is up and running!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee-evaluation")
    public ResponseEntity<?> getEmployeeEvaluationReport(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Map<String, Object> response = reportService.getEmployeeEvaluationReport(departmentId, status, startdate,
                enddate, page, size);
        return ResponseEntity.ok(response);
    }

    @Autowired
    private com.mtp.report.services.ReportExportService reportExportService;

    @GetMapping("/employee-evaluation/export/excel")
    public ResponseEntity<byte[]> exportEmployeeEvaluationExcel(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate) {

        try {
            java.util.List<Map<String, Object>> data = reportService.getExportEmployeeEvaluationReport(departmentId,
                    status, startdate, enddate);
            byte[] excelBytes = reportExportService.generateExcelReport(data);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType
                    .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "Employee_Evaluation_Report.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(excelBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/employee-evaluation/export/pdf")
    public ResponseEntity<byte[]> exportEmployeeEvaluationPdf(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate) {

        try {
            java.util.List<Map<String, Object>> data = reportService.getExportEmployeeEvaluationReport(departmentId,
                    status, startdate, enddate);
            byte[] pdfBytes = reportExportService.generatePdfReport(data);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Employee_Evaluation_Report.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
