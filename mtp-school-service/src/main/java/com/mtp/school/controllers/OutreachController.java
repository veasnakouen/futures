package com.mtp.school.controllers;

import com.mtp.school.models.OutreachVisit;
import com.mtp.school.repositories.OutreachVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/outreach-visits")
public class OutreachController {

    @Autowired
    private OutreachVisitRepository outreachVisitRepository;

    @GetMapping
    public List<OutreachVisit> getAllVisits(@RequestAttribute("tenantId") String tenantId) {
        return outreachVisitRepository.findByTenantId(tenantId);
    }

    @GetMapping("/student/{studentId}")
    public List<OutreachVisit> getVisitsByStudent(@RequestAttribute("tenantId") String tenantId, @PathVariable String studentId) {
        return outreachVisitRepository.findByTenantIdAndStudentId(tenantId, studentId);
    }

    @PostMapping
    public OutreachVisit createVisit(@RequestAttribute("tenantId") String tenantId, @RequestBody OutreachVisit visit) {
        visit.setTenantId(tenantId);
        return outreachVisitRepository.save(visit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OutreachVisit> updateVisit(@RequestAttribute("tenantId") String tenantId, @PathVariable String id, @RequestBody OutreachVisit visitDetails) {
        return outreachVisitRepository.findById(id).map(visit -> {
            visit.setVisitDate(visitDetails.getVisitDate());
            visit.setCommunityEntryNotes(visitDetails.getCommunityEntryNotes());
            visit.setNeedsAssessmentSurvey(visitDetails.getNeedsAssessmentSurvey());
            visit.setServiceDelivery(visitDetails.getServiceDelivery());
            visit.setReferralNeeded(visitDetails.getReferralNeeded());
            visit.setNextVisitDate(visitDetails.getNextVisitDate());
            return ResponseEntity.ok(outreachVisitRepository.save(visit));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable String id) {
        outreachVisitRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
