package com.mtp.clinic.models;

import com.mtp.clinic.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "ClinicRoom")
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

    @Column(name = "room_number", nullable = false)
    private String roomNumber;
    
    @Column(name = "room_type")
    private String roomType;
    
    @Enumerated(EnumType.STRING)
    private RoomStatus status;
    
    @Column(name = "ward_name")
    private String wardName;
    
    private String floor;
    
    @Column(name = "bed_capacity")
    private Integer bedCapacity = 1;
}
