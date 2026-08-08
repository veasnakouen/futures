package com.mtp.stock.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;
import com.mtp.stock.models.stubs.DepartmentStub;
import java.time.LocalDateTime;

@Entity
@Table(name = "Locations")
@Audited
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Location name is required")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = true)
    private DepartmentStub department;

    private String type; // e.g., WAREHOUSE, CLINIC_PHARMACY, HOTEL_STORAGE

    @Column(name = "serviceId")
    private String serviceId; // Bound Eureka Service ID (e.g., mtp-clinic-service)

    @Transient
    private String status; // e.g., ONLINE, OFFLINE (dynamically fetched from Eureka)

    private String address;

    private String managerName;

    private Boolean isActive = true;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();
}
