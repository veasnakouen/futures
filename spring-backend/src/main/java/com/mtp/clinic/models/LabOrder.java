package com.mtp.clinic.models;

import com.mtp.clinic.enums.Status;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "clinic_lab_orders")
public class LabOrder {
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private String id;

@org.hibernate.annotations.TenantId
@Column(name = "tenant_id")
private String tenantId;
@Column(name = "test_name")
private String testName;
@Column(name = "loinc_code")
private String loincCode;
private Status status;
@Column(name = "result_value")
private String resultValue;
@Column(name = "reference_range")
private String referenceRange;
@Column(name = "abnormal_flag")
private String abnormalFlag;
}
