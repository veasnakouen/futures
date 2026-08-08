package com.mtp.stock.services;

import com.mtp.stock.models.*;
import com.mtp.stock.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MaintenanceWorkflowService {

    private final MaintenanceTicketRepository ticketRepository;
    private final ITAssessmentRepository assessmentRepository;
    private final ProcurementRequestRepository procurementRepository;
    private final AssetRepository assetRepository;

    public MaintenanceWorkflowService(MaintenanceTicketRepository ticketRepository,
                                      ITAssessmentRepository assessmentRepository,
                                      ProcurementRequestRepository procurementRepository,
                                      AssetRepository assetRepository) {
        this.ticketRepository = ticketRepository;
        this.assessmentRepository = assessmentRepository;
        this.procurementRepository = procurementRepository;
        this.assetRepository = assetRepository;
    }

    @Transactional
    public MaintenanceTicket reportBrokenAsset(Integer assetId, String issueDescription) {
        CompanyAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        asset.setStatus("Maintenance");
        assetRepository.save(asset);

        MaintenanceTicket ticket = new MaintenanceTicket();
        ticket.setAsset(asset);
        ticket.setIssueDescription(issueDescription);
        ticket.setStatus("OPEN");
        return ticketRepository.save(ticket);
    }

    @Transactional
    public ITAssessment submitITAssessment(Long ticketId, String findings, boolean isRepairable, Double estimatedCost) {
        MaintenanceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        ITAssessment assessment = new ITAssessment();
        assessment.setTicket(ticket);
        assessment.setTechnicalFindings(findings);
        assessment.setIsRepairable(isRepairable);
        assessment.setEstimatedRepairCost(estimatedCost);

        if (isRepairable) {
            assessment.setRecommendation("REPAIR");
            ticket.setStatus("IN_REPAIR");
        } else {
            assessment.setRecommendation("REPLACE");
            ticket.setStatus("REQUIRES_REPLACEMENT");

            // Auto-trigger Procurement Request to Accountant
            ProcurementRequest pr = new ProcurementRequest();
            pr.setAssessment(assessment);
            pr.setJustification("IT assessed the asset and it cannot be repaired. Cost of replacement estimated.");
            pr.setEstimatedReplacementCost(estimatedCost);
            pr.setStatus("PENDING_APPROVAL");
            procurementRepository.save(pr);
        }

        ticketRepository.save(ticket);
        return assessmentRepository.save(assessment);
    }

    @Transactional
    public ProcurementRequest approveProcurement(Long procurementId, String notes) {
        ProcurementRequest pr = procurementRepository.findById(procurementId)
                .orElseThrow(() -> new IllegalArgumentException("Procurement Request not found"));

        pr.setStatus("APPROVED");
        pr.setApprovalDate(LocalDateTime.now());
        pr.setAccountantNotes(notes);
        procurementRepository.save(pr);

        // Decommission the original asset
        CompanyAsset asset = pr.getAssessment().getTicket().getAsset();
        asset.setStatus("Decommissioned - Replaced");
        asset.setIsActive(false);
        assetRepository.save(asset);

        // Resolve ticket
        MaintenanceTicket ticket = pr.getAssessment().getTicket();
        ticket.setStatus("RESOLVED");
        ticket.setResolvedDate(LocalDateTime.now());
        ticketRepository.save(ticket);

        return pr;
    }
}
