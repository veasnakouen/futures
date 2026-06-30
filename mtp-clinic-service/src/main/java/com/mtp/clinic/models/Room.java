package com.mtp.clinic.models;

import com.mtp.clinic.enums.Status;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "clinic_rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(nullable = false)
    private String roomNumber;
    private String roomType;
    private Status status;
}
