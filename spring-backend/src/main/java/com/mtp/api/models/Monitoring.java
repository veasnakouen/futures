package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Monitorings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Monitoring {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 50)
    private String monitoringTime;

    @NotNull
    @Size(max = 255)
    private String enroll;

    @NotNull
    @Size(max = 255)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    private Client client;

    @NotNull
    private LocalDateTime monitoringDate;

    @NotNull
    private LocalDateTime nextMonitoringDate;

    @NotNull
    @Size(max = 255)
    private String monitoringtype;

    private Integer placementId;
}
