package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "FurthereducationInProgresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FurtherEducationInProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MonitoringId")
    private Monitoring monitoring;

    @NotNull
    @Size(max = 50)
    private String ontraining;

    private LocalDateTime graduateDate;
    private LocalDateTime dropoutDate;

    @NotNull
    @Size(max = 250)
    private String reason;
}
