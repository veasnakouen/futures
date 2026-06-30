package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_lockers")
@Data
@NoArgsConstructor
public class Locker {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String lockerNumber;
}
