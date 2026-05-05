package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "SocialsupportCases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialsupportCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 10)
    private String haveCaseManager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CaseWorkerId")
    private CaseWorker caseWorker;

    private LocalDateTime openDate;
    private LocalDateTime closeDate;

    @NotNull
    @Size(max = 10)
    private String haveProblem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    private Client client;

    @NotNull
    private String status;

    private String accessBy;
    private LocalDateTime accessDate;
}
