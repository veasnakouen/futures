package com.mtp.attendance.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "attendance_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long departmentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceMode mode = AttendanceMode.STATIC_PRINTED;

    private boolean enforceGeofencing = true;
    private boolean enforceNetworkSecurity = true;

    private Double latitude;
    private Double longitude;
    private Double allowedRadiusMeters = 50.0;

    @ElementCollection
    @CollectionTable(name = "attendance_allowed_ips", joinColumns = @JoinColumn(name = "config_id"))
    @Column(name = "ip_address")
    private List<String> allowedIpAddresses;
}
