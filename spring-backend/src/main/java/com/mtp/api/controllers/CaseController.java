package com.mtp.api.controllers;

import com.mtp.api.models.Case;
import com.mtp.api.repositories.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.dto.pagination.PagedResponse;
import com.mtp.api.dto.pagination.PaginationRequest;
import jakarta.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "*")
public class CaseController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "openDate", "closeDate", "subject", "priority", "status", "serviceType");

    @Autowired
    private CaseRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Case>>> getAllCases(
            @Valid @ModelAttribute PaginationRequest request,
            @RequestParam(required = false) String status) {
        Pageable pageable = request.toPageable(ALLOWED_SORT_FIELDS);
        Page<Case> pageResult;
        if (status != null && !status.isEmpty() && !"All".equalsIgnoreCase(status)) {
            pageResult = repository.findByStatus(status, pageable);
        } else {
            pageResult = repository.findAll(pageable);
        }
        PagedResponse<Case> response = PagedResponse.from(pageResult, request.getSortBy(), request.getSortOrder());
        return ResponseEntity.ok(ApiResponse.success("Cases fetched successfully", response));
    }

    @GetMapping("/client/{clientId}")
    public List<Case> getByClient(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @Autowired
    private com.mtp.api.repositories.ClientRepository clientRepository;

    @Autowired
    private com.mtp.api.repositories.CaseWorkerRepository caseWorkerRepository;

    @PostMapping
    public Case create(@RequestBody CaseDTO dto) {
        Case kase = new Case();
        kase.setSubject(dto.getSubject());
        kase.setDescription(dto.getDescription());
        kase.setPriority(dto.getPriority());
        kase.setServiceType(dto.getServiceType());
        kase.setOpenDate(LocalDateTime.now());
        kase.setStatus("Open");

        if (dto.getClientId() != null && !dto.getClientId().isEmpty()) {
            clientRepository.findById(Integer.parseInt(dto.getClientId())).ifPresent(kase::setClient);
        }

        // Assign a default Case Worker to satisfy database constraints
        caseWorkerRepository.findAll().stream().findFirst().ifPresent(kase::setCaseWorker);

        return repository.save(kase);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Case> update(@PathVariable Integer id, @RequestBody CaseDTO dto) {
        return repository.findById(id).map(kase -> {
            kase.setSubject(dto.getSubject());
            kase.setDescription(dto.getDescription());
            kase.setPriority(dto.getPriority());
            kase.setServiceType(dto.getServiceType());

            if (dto.getClientId() != null && !dto.getClientId().isEmpty()) {
                clientRepository.findById(Integer.parseInt(dto.getClientId())).ifPresent(kase::setClient);
            }

            if (kase.getCaseWorker() == null) {
                caseWorkerRepository.findAll().stream().findFirst().ifPresent(kase::setCaseWorker);
            }

            return ResponseEntity.ok(repository.save(kase));
        }).orElse(ResponseEntity.notFound().build());
    }

    public static class CaseDTO {
        private String clientId;
        private String subject;
        private String description;
        private String priority;
        private String serviceType;

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public String getServiceType() {
            return serviceType;
        }

        public void setServiceType(String serviceType) {
            this.serviceType = serviceType;
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return repository.findById(id).map(kase -> {
            repository.delete(kase);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Case> updateStatus(@PathVariable Integer id,
            @RequestBody java.util.Map<String, String> payload) {
        return repository.findById(id).map(kase -> {
            String status = payload.get("status");
            if (status != null) {
                kase.setStatus(status);
                if ("Closed".equalsIgnoreCase(status) && kase.getCloseDate() == null) {
                    kase.setCloseDate(LocalDateTime.now());
                }
            }
            return ResponseEntity.ok(repository.save(kase));
        }).orElse(ResponseEntity.notFound().build());
    }
}
