package com.mtp.billing.models;

import com.mtp.billing.enums.ModuleSource;


import java.time.LocalDate;

import com.mtp.billing.enums.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "sys_payment")
@NoArgsConstructor
public class Payment {
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private String id;

@org.hibernate.annotations.TenantId
@Column(name = "tenant_id")
private String tenantId;
private int amount;
private LocalDate submitDate;
private Status status;
private int adjudicatedAmount;

private String referenceId;
private ModuleSource sourceModule = ModuleSource.CLINIC;
}
