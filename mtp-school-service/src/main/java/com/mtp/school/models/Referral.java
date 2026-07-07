package com.mtp.school.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "school_referrals")
@Data
@NoArgsConstructor
public class Referral {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referral_case_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private ReferralCase referralCase;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "status")
    private String status; // Pending, Active, Resolved

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "custom_attributes", columnDefinition = "NVARCHAR(MAX)")
    private String customAttributes;
}
