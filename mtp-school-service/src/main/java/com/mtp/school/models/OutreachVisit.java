package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "school_outreach_visits")
@Data
@NoArgsConstructor
public class OutreachVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    @Column(name = "community_entry_notes", columnDefinition = "TEXT")
    private String communityEntryNotes;

    @Column(name = "needs_assessment_survey", columnDefinition = "TEXT")
    private String needsAssessmentSurvey;

    @Column(name = "service_delivery", columnDefinition = "TEXT")
    private String serviceDelivery;

    @Column(name = "referral_needed")
    private Boolean referralNeeded;

    @Column(name = "next_visit_date")
    private LocalDate nextVisitDate;

    @Column(name = "status")
    private String status; // LEAD, REGISTERED, SCREENING, HOME_VISIT, COMMITTEE_REVIEW, APPROVED, REJECTED

    @Column(name = "assessment_score")
    private Integer assessmentScore;

    @Column(name = "committee_notes", columnDefinition = "TEXT")
    private String committeeNotes;
}
