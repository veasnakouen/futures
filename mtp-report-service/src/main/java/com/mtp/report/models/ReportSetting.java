package com.mtp.report.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ReportSettings")
public class ReportSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String userId;

    @Column(nullable = false, length = 255)
    private String reportName;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String preferences; // Stored as JSON string
}
