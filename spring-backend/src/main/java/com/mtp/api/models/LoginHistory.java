package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "LoginHistories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 450)
    private String loggedBy;
    private LocalDateTime loggedDate;
    private String ipAddress;
    private String hostName;

    // --- Extended Security & Tracking Features ---
    private String deviceType; // Desktop, Mobile, Tablet
    private String os; // Windows, macOS, Linux, iOS, Android
    private String browser; // Chrome, Safari, Firefox, Edge
    private String location; // City, Country
    private String dataUsageType; // Heavy, Standard, API Access
    private String status; // Success, Failed, Suspicious
}
