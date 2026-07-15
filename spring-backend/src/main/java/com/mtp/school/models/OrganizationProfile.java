package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_organizations")
@Data
@NoArgsConstructor
public class OrganizationProfile {
    @Id
    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type;

    private String contactEmail;
    
    @Column(length = 2000)
    private String settings; // JSON representation of rules or settings
}
