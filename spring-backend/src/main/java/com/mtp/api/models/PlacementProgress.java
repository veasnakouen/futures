package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "PlacementProgresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacementProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MonitoringId")
    private Monitoring monitoring;

    @NotNull
    private String placementStatus;

    @NotNull
    private String salary;

    private String note;
}
