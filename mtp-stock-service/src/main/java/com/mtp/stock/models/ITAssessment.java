package com.mtp.stock.models;

import com.mtp.stock.models.stubs.EmployeeStub;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;

@Entity
@Table(name = "ITAssessments")
@Audited
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ITAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private MaintenanceTicket ticket;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assessed_by_id")
    @org.hibernate.envers.Audited(targetAuditMode = org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED)
    private EmployeeStub assessedBy;

    @Column(columnDefinition = "TEXT")
    private String technicalFindings;

    private Boolean isRepairable;
    private Double estimatedRepairCost;

    // REPAIR, REPLACE
    private String recommendation;

    private LocalDateTime assessmentDate = LocalDateTime.now();
}
