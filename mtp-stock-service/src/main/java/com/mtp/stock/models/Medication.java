package com.mtp.stock.models;

import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Medication {
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private String id;

@org.hibernate.annotations.TenantId
@Column(name = "tenant_id")
private String tenantId;
private String name;
private String genericName;
@Enumerated
private String Category;
}
