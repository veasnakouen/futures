package com.mtp.stock.models;

import com.mtp.stock.models.stubs.EmployeeStub;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;

@Entity
@Table(name = "MaintenanceTickets")
@Audited
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    @org.hibernate.envers.Audited(targetAuditMode = org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED)
    private CompanyAsset asset;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by_id")
    @org.hibernate.envers.Audited(targetAuditMode = org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED)
    private EmployeeStub reportedBy;

    @Column(columnDefinition = "TEXT")
    private String issueDescription;

    // OPEN, IN_ASSESSMENT, REQUIRES_REPLACEMENT, RESOLVED
    private String status;

    private LocalDateTime reportedDate = LocalDateTime.now();
    private LocalDateTime resolvedDate;
}
