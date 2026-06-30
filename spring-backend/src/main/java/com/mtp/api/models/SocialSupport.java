package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "SocialSupports")
@Data
public class SocialSupport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "ClientId")
    private Integer clientId;

    @NotNull
    @Column(name = "CaseId")
    private Integer caseId;

    @Column(name = "HealthProblembool")
    private boolean healthProblem;

    @Size(max = 255)
    @Column(name = "HealthProblem")
    private String healthProblemDetail;

    @Column(name = "DrugProblembool")
    private boolean drugProblem;

    @Size(max = 255)
    @Column(name = "DrugProblem")
    private String drugProblemDetail;

    @Column(name = "BabyProblembool")
    private boolean babyProblem;

    @Size(max = 255)
    @Column(name = "BabyProblem")
    private String babyProblemDetail;

    @Column(name = "PersonalProblembool")
    private boolean personalProblem;

    @Size(max = 255)
    @Column(name = "PersonalProblem")
    private String personalProblemDetail;

    @Column(name = "LegalProblembool")
    private boolean legalProblem;

    @Size(max = 255)
    @Column(name = "LegalProblem")
    private String legalProblemDetail;

    @Column(name = "OtherProblembool")
    private boolean otherProblem;

    @Size(max = 255)
    @Column(name = "OtherProblem")
    private String otherProblemDetail;

    @Column(name = "Description")
    private String description;
}
