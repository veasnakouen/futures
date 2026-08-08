package com.mtp.stock.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;

@Entity
@Table(name = "ProcurementRequests")
@Audited
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assessment_id", nullable = false, unique = true)
    private ITAssessment assessment;

    @Column(columnDefinition = "TEXT")
    private String justification;

    private Double estimatedReplacementCost;

    // PENDING_APPROVAL, APPROVED, REJECTED, PURCHASED
    private String status;

    @Column(columnDefinition = "TEXT")
    private String accountantNotes;

    private LocalDateTime requestDate = LocalDateTime.now();
    private LocalDateTime approvalDate;
}
