package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "school_referral_cases")
@Data
@NoArgsConstructor
public class ReferralCase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "outreach_visit_id")
    private String outreachVisitId;

    @Column(name = "lead_coordinator")
    private String leadCoordinator;

    @Column(name = "status")
    private String status; // Open, In Progress, Closed

    @Column(name = "initial_case_plan", columnDefinition = "TEXT")
    private String initialCasePlan;

    @Column(name = "monitoring_notes", columnDefinition = "TEXT")
    private String monitoringNotes;

    @Column(name = "exit_plan", columnDefinition = "TEXT")
    private String exitPlan;

    @OneToMany(mappedBy = "referralCase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Referral> referrals = new ArrayList<>();
}
