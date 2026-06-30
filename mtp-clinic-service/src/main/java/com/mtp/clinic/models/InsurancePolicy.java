package com.mtp.clinic.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@jakarta.persistence.Table(name = "clinic_insurance_policies")
public class InsurancePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @jakarta.persistence.Column(name = "tenant_id")
    private String tenantId;

    private String policyNumber;
    // private String insuranceProvider;
    private String groupNumber;
    private Double coveragePercentage;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private String policyHolderName;
    private String policyHolderContactNumber;
    private String policyHolderAddress;
    private String policyHolderEmail;
    
}
