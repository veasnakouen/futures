package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "FutureTrainingProgresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FutureTrainingProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MonitoringId")
    private Monitoring monitoring;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LessionId")
    private Lession lession;

    @NotNull
    @Size(max = 50)
    private String ontraining;

    private LocalDateTime graduateDate;
    private LocalDateTime dropoutDate;

    @Size(max = 250)
    private String reason;
}
