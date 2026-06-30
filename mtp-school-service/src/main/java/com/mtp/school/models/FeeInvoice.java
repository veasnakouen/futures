package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_fee_invoices")
@Data
@NoArgsConstructor
public class FeeInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
