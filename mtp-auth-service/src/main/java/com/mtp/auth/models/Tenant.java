package com.mtp.auth.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "tenants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {

    public enum TenantType {
        NGO, PRIVATE, PUBLIC
    }

    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id; // e.g. "clinic-a"

    @Column(nullable = false)
    private String name; // e.g. "Main Street Clinic"

    @Enumerated(EnumType.STRING)
    @Column(name = "tenant_type")
    private TenantType tenantType = TenantType.PRIVATE; // Default to PRIVATE

    private String managerEmail;

    @Column(nullable = false)
    private Boolean isActive;

    private LocalDate subscriptionEndDate;

    @Column(name = "max_devices")
    private Integer maxDevices;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tenant_modules", joinColumns = @JoinColumn(name = "tenant_id"))
    @Column(name = "module_name")
    @Builder.Default
    private List<String> allowedModules = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
