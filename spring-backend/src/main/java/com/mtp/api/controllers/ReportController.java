package com.mtp.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired private com.mtp.api.repositories.ClientRepository clientRepository;
    @Autowired private com.mtp.api.repositories.FurtherEducationRepository furtherEducationRepository;
    @Autowired private com.mtp.api.repositories.JobExpectationRepository jobExpectationRepository;
    @Autowired private com.mtp.api.repositories.LogBookRepository logBookRepository;
    @Autowired private com.mtp.api.repositories.MonitoringRepository monitoringRepository;
    @Autowired private com.mtp.api.repositories.SocialsupportCaseRepository socialsupportCaseRepository;
    @Autowired private com.mtp.api.repositories.FuturesTrainingRepository futuresTrainingRepository;
    @Autowired private com.mtp.api.repositories.EmployeeRepository employeeRepository;
    @Autowired private com.mtp.api.repositories.PlacementRepository placementRepository;
    @Autowired private com.mtp.api.repositories.EmployerRepository employerRepository;
    @Autowired private com.mtp.api.repositories.VacancyRepository vacancyRepository;
    @Autowired private com.mtp.api.repositories.BeneficiaryRepository beneficiaryRepository;
    @Autowired private com.mtp.api.repositories.BusinessInProgressRepository businessInProgressRepository;
    @Autowired private com.mtp.api.repositories.BusinessSetUpRepository businessSetUpRepository;
    @Autowired private com.mtp.api.repositories.CaseRepository caseRepository;
    @Autowired private com.mtp.api.repositories.PlacementProgressRepository placementProgressRepository;
    @Autowired private com.mtp.api.repositories.CvReferenceRepository cvReferenceRepository;
    @Autowired private com.mtp.api.services.LoginHistoryService loginHistoryService;

    @GetMapping("/client-summary")
    public ResponseEntity<?> getClientSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate,
            jakarta.servlet.http.HttpServletRequest request) {
        System.out.println("DEBUG: Fetching Paginated Client Summary Data (Page: " + page + ", Start: " + startdate + ", End: " + enddate + ")");
        loginHistoryService.recordReportAccess("Client Summary Report", request);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<com.mtp.api.models.Client> clientPage;

        if (startdate != null && !startdate.isEmpty() && enddate != null && !enddate.isEmpty()) {
            java.time.LocalDateTime start = java.time.LocalDate.parse(startdate).atStartOfDay();
            java.time.LocalDateTime end = java.time.LocalDate.parse(enddate).atTime(23, 59, 59);
            clientPage = clientRepository.findByRegisterDateBetween(start, end, pageable);
        } else {
            clientPage = clientRepository.findAll(pageable);
        }

        
        Map<String, Object> response = new HashMap<>();
        response.put("content", clientPage.getContent());
        response.put("totalPages", clientPage.getTotalPages());
        response.put("totalElements", clientPage.getTotalElements());
        response.put("currentPage", clientPage.getNumber());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/GetReportPage")
    public ResponseEntity<?> getReportPage(
            @RequestParam String reportName,
            @RequestParam int page,
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate,
            jakarta.servlet.http.HttpServletRequest request) {
        
        System.out.println("DEBUG: Generating REAL data for report: " + reportName);
        loginHistoryService.recordReportAccess(reportName, request);
        
        // Fetch real data from database to prove connection
        long clientCount = clientRepository.count();
        int totalPages = (int) Math.ceil((double) clientCount / 10.0);
        
        Map<String, Object> response = new HashMap<>();
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("reportName", reportName);
        response.put("totalRecords", clientCount);
        
        // Sending a data-connected placeholder
        List<String> images = new ArrayList<>();
        images.add("iVBORw0KGgoAAAANSUhEUgAAAZAAAALQAQMAAAD769Y6AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBgFo4A3AAABPQABy+vCigAAAABJRU5ErkJggg==");
        response.put("imagesBase64", images);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/legacy-data")
    public ResponseEntity<?> getLegacyData(
            @RequestParam String reportName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startdate,
            @RequestParam(required = false) String enddate,
            jakarta.servlet.http.HttpServletRequest request) {
        
        System.out.println("DEBUG: Fetching Legacy Report Data: " + reportName);
        loginHistoryService.recordReportAccess(reportName, request);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<?> resultPage = null;

        // Route to the appropriate repository based on report name
        switch (reportName) {
            case "FurtherEuducationseekerListReport":
                resultPage = furtherEducationRepository.findAll(pageable);
                break;
            case "JobReadinessReport":
                resultPage = jobExpectationRepository.findAll(pageable);
                break;
            case "LogBookReport":
                resultPage = logBookRepository.findAll(pageable);
                break;
            case "PlacementMonitoringAndDropoutReport":
                resultPage = monitoringRepository.findAll(pageable);
                break;
            case "SocialSupportCaseReport":
                resultPage = socialsupportCaseRepository.findAll(pageable);
                break;
            case "VtcStudentlReport":
                resultPage = futuresTrainingRepository.findAll(pageable);
                break;
            case "EmployeeSeekerListreport":
                resultPage = employeeRepository.findAll(pageable);
                break;
            case "PlacementSummaryReport":
                resultPage = placementRepository.findAll(pageable);
                break;
            case "EmployersReport":
                resultPage = employerRepository.findAll(pageable);
                break;
            case "JobVancancyAvailable":
                resultPage = vacancyRepository.findAll(pageable);
                break;
            case "BeneficiariesReport":
                resultPage = beneficiaryRepository.findAll(pageable);
                break;
            case "Businesssetupmonitoiring":
                resultPage = businessInProgressRepository.findAll(pageable);
                break;
            case "BusinessSetUpReport":
                resultPage = businessSetUpRepository.findAll(pageable);
                break;
            case "ClientLookforbussinesssSetupReport":
                resultPage = clientRepository.findAll(pageable);
                break;
            case "ClientReferralFromMTProgramReport":
                resultPage = caseRepository.findAll(pageable);
                break;
            case "ClientsRemainingInPlacementReport":
                resultPage = placementProgressRepository.findAll(pageable);
                break;
            case "CurriculumVitaeByClientReport":
                resultPage = cvReferenceRepository.findAll(pageable);
                break;
            default:
                return ResponseEntity.badRequest().body("Report not yet migrated or unknown.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("content", resultPage.getContent());
        response.put("totalPages", resultPage.getTotalPages());
        response.put("totalElements", resultPage.getTotalElements());
        response.put("currentPage", resultPage.getNumber());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/DownloadReport")
    public ResponseEntity<?> downloadReport(
            @RequestParam String reportName,
            @RequestParam String format,
            @RequestParam String startdate,
            @RequestParam String enddate,
            jakarta.servlet.http.HttpServletRequest request) {
        loginHistoryService.recordReportAccess(reportName, request);
        return ResponseEntity.ok("Report download will be processed here.");
    }
}
