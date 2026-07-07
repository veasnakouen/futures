package com.mtp.school.controllers;

import com.mtp.school.models.Referral;
import com.mtp.school.models.ReferralCase;
import com.mtp.school.repositories.ReferralCaseRepository;
import com.mtp.school.repositories.ReferralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/referral-cases")
public class ReferralCaseController {

    @Autowired
    private ReferralCaseRepository referralCaseRepository;
    
    @Autowired
    private ReferralRepository referralRepository;

    @GetMapping
    public List<ReferralCase> getAllCases(@RequestAttribute("tenantId") String tenantId,
                                          @RequestHeader(value = "X-Username", required = false) String username,
                                          @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        List<ReferralCase> cases = referralCaseRepository.findByTenantId(tenantId);
        cases.forEach(c -> maskNotesIfUnauthorized(c, username, roles));
        return cases;
    }

    @GetMapping("/student/{studentId}")
    public List<ReferralCase> getCasesByStudent(@RequestAttribute("tenantId") String tenantId, 
                                                @PathVariable String studentId,
                                                @RequestHeader(value = "X-Username", required = false) String username,
                                                @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        List<ReferralCase> cases = referralCaseRepository.findByTenantIdAndStudentId(tenantId, studentId);
        cases.forEach(c -> maskNotesIfUnauthorized(c, username, roles));
        return cases;
    }

    @GetMapping("/referrals/by-departments")
    public List<Referral> getReferralsByDepartments(@RequestAttribute("tenantId") String tenantId, 
                                                    @RequestParam List<Long> departmentIds,
                                                    @RequestHeader(value = "X-Username", required = false) String username,
                                                    @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        List<Referral> refs = referralRepository.findByTenantIdAndDepartmentIdIn(tenantId, departmentIds);
        refs.forEach(r -> {
            boolean hasAccess = checkReferralAccess(r, r.getReferralCase(), username, roles);
            if (!hasAccess) {
                r.setNotes("*Redacted for privacy: You do not have permission to view these notes*");
            }
        });
        return refs;
    }

    @PostMapping
    public ReferralCase createCase(@RequestAttribute("tenantId") String tenantId, @RequestBody ReferralCase referralCase) {
        referralCase.setTenantId(tenantId);
        if (referralCase.getReferrals() != null) {
            for (Referral ref : referralCase.getReferrals()) {
                ref.setTenantId(tenantId);
                ref.setReferralCase(referralCase);
            }
        }
        return referralCaseRepository.save(referralCase);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReferralCase> updateCase(@RequestAttribute("tenantId") String tenantId, @PathVariable String id, @RequestBody ReferralCase caseDetails) {
        return referralCaseRepository.findById(id).map(existingCase -> {
            existingCase.setStatus(caseDetails.getStatus());
            existingCase.setLeadCoordinator(caseDetails.getLeadCoordinator());
            return ResponseEntity.ok(referralCaseRepository.save(existingCase));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{caseId}/referrals")
    public ResponseEntity<Referral> addReferralToCase(@RequestAttribute("tenantId") String tenantId, @PathVariable String caseId, @RequestBody Referral referral) {
        return referralCaseRepository.findById(caseId).map(existingCase -> {
            referral.setTenantId(tenantId);
            referral.setReferralCase(existingCase);
            return ResponseEntity.ok(referralRepository.save(referral));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/referrals/{referralId}")
    public ResponseEntity<Referral> updateReferral(@RequestAttribute("tenantId") String tenantId, 
                                                   @PathVariable String referralId, 
                                                   @RequestBody Referral referralDetails,
                                                   @RequestHeader(value = "X-Username", required = false) String username,
                                                   @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        return referralRepository.findById(referralId).map(existing -> {
            boolean hasAccess = checkReferralAccess(existing, existing.getReferralCase(), username, roles);
            
            // Only update notes if user has permission and is not sending back the redacted string
            if (hasAccess && referralDetails.getNotes() != null && !referralDetails.getNotes().startsWith("*Redacted for privacy")) {
                existing.setNotes(referralDetails.getNotes());
            }

            existing.setStatus(referralDetails.getStatus());
            existing.setAssignedTo(referralDetails.getAssignedTo());
            return ResponseEntity.ok(referralRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    private void maskNotesIfUnauthorized(ReferralCase c, String username, String roles) {
        if (c.getReferrals() == null) return;
        
        for (Referral ref : c.getReferrals()) {
            boolean hasAccess = checkReferralAccess(ref, c, username, roles);
            if (!hasAccess) {
                ref.setNotes("*Redacted for privacy: You do not have permission to view these notes*");
            }
        }
    }

    private boolean checkReferralAccess(Referral ref, ReferralCase c, String username, String roles) {
        boolean isLead = username != null && c != null && username.equals(c.getLeadCoordinator());
        boolean isAssignedTo = username != null && username.equals(ref.getAssignedTo());
        boolean isAdmin = roles != null && (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_SUPERADMIN"));
        
        boolean hasDeptRole = false;
        if (ref.getDepartment() != null && ref.getDepartment().getRequiredRole() != null && !ref.getDepartment().getRequiredRole().isBlank()) {
            hasDeptRole = roles != null && roles.contains(ref.getDepartment().getRequiredRole());
        } else if (ref.getDepartment() != null && (ref.getDepartment().getRequiredRole() == null || ref.getDepartment().getRequiredRole().isBlank())) {
            // If department has no required role, assume public/open access
            hasDeptRole = true;
        }

        return isLead || isAssignedTo || isAdmin || hasDeptRole;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCase(@PathVariable String id) {
        referralCaseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
