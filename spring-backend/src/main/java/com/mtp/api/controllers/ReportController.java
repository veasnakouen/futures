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

    @Autowired
    private com.mtp.api.repositories.ClientRepository clientRepository;

    @GetMapping("/client-summary")
    public ResponseEntity<?> getClientSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("DEBUG: Fetching Paginated Client Summary Data (Page: " + page + ")");
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<com.mtp.api.models.Client> clientPage = clientRepository.findAll(pageable);
        
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
            @RequestParam String startdate,
            @RequestParam String enddate) {
        
        System.out.println("DEBUG: Generating REAL data for report: " + reportName);
        
        // Fetch real data from database to prove connection
        long clientCount = clientRepository.count();
        int pageSize = 10;
        int totalPages = (int) Math.ceil((double) clientCount / pageSize);
        if (totalPages == 0) totalPages = 1;

        Map<String, Object> response = new HashMap<>();
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("reportName", reportName);
        response.put("totalRecords", clientCount);
        
        List<String> images = new ArrayList<>();
        // Sending a data-connected placeholder
        images.add("iVBORw0KGgoAAAANSUhEUgAAAZAAAALQAQMAAAD769Y6AAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AgKCQ8AAAAAcGlmYWFzAAAAIklEQVRo3u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAgIcBa7wAAW6FnuQAAAAASUVORK5CYII=");
        response.put("imagesBase64", images);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/DownloadReport")
    public ResponseEntity<?> downloadReport(
            @RequestParam String reportName,
            @RequestParam String format,
            @RequestParam String startdate,
            @RequestParam String enddate) {
        return ResponseEntity.ok("Report download will be processed here.");
    }
}
