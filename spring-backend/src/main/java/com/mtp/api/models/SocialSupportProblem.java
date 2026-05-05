package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "SocialSupportProblems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialSupportProblem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SocialSupportCaseId")
    private SocialsupportCase socialsupportCase;

    private boolean healthProblembool;
    private boolean drugProblembool;
    private boolean babyProblembool;
    private boolean personalProblembool;
    private boolean legalProblembool;
    private boolean otherProblembool;

    @Size(max = 510)
    private String note;

    private String status;
}
