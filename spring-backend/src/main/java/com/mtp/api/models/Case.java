package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Case {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ClientId")
    private Client client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CaseWorkerId")
    private CaseWorker caseWorker;

    @NotNull
    @Size(max = 50)
    private String priority;

    @NotNull
    @Size(max = 50)
    private String serviceType;

    @Size(max = 255)
    private String subject;

    @Size(max = 510)
    private String description;

    @NotNull
    private LocalDateTime openDate;

    private LocalDateTime closeDate;

    @Size(max = 50)
    private String status;
}
