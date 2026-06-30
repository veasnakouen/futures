package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "JobApplications", indexes = {
    @Index(name = "idx_jobapp_client", columnList = "ClientId"),
    @Index(name = "idx_jobapp_vacancy", columnList = "VacancyId"),
    @Index(name = "idx_jobapp_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    @NotNull
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VacancyId")
    @NotNull
    private Vacancy vacancy;

    @NotNull
    private LocalDateTime appliedDate;

    @Size(max = 50)
    @NotNull
    private String status; // PENDING, REVIEWING, INTERVIEWING, HIRED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Size(max = 500)
    private String cvUrl;
}
