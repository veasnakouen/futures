package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Vacancies", indexes = {
    @Index(name = "idx_vacancy_status", columnList = "status"),
    @Index(name = "idx_vacancy_employer", columnList = "EmployerId"),
    @Index(name = "idx_vacancy_category", columnList = "JobCategoryId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vacancy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private LocalDateTime postingDate;

    @NotNull
    private LocalDateTime deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerId")
    private Employer employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobPositionId")
    private JobPosition jobPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobCategoryId")
    private JobCategory jobCategory;

    @NotNull
    private int positionAvailable;

    @Size(max = 255)
    private String contractType;

    @Size(max = 255)
    private String schedule;

    @NotNull
    private Double salary;

    @NotNull
    private Double salarymax;

    @Size(max = 510)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String requirement;

    @Column(columnDefinition = "TEXT")
    private String applicationInformation;

    @NotNull
    private String status;

    private int viewCount = 0;

    @Size(max = 255)
    private String branch;

    @Size(max = 500)
    private String imageUrl;
}

