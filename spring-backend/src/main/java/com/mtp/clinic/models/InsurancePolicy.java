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

    @jakarta.persistence.Column(name = "policy_number")
    private String policyNumber;
    // private String insuranceProvider;
    @jakarta.persistence.Column(name = "group_number")
    private String groupNumber;
    @jakarta.persistence.Column(name = "coverage_percentage")
    private Double coveragePercentage;
    @jakarta.persistence.Column(name = "effective_date")
    private LocalDate effectiveDate;
    @jakarta.persistence.Column(name = "expiry_date")
    private LocalDate expiryDate;
    @jakarta.persistence.Column(name = "policy_holder_name")
    private String policyHolderName;
    @jakarta.persistence.Column(name = "policy_holder_contact_number")
    private String policyHolderContactNumber;
    @jakarta.persistence.Column(name = "policy_holder_address")
    private String policyHolderAddress;
    @jakarta.persistence.Column(name = "policy_holder_email")
    private String policyHolderEmail;
    
}
