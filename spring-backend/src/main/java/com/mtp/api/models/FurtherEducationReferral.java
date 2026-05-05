package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "FurtherEducationReferrals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FurtherEducationReferral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    private Client client;

    private LocalDateTime referralDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "furtherEducationReferralSubjectId")
    private FurtherEducationReferralSubject furtherEducationReferralSubject;

    private String provider;
    private String duration;
    private String referralBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EducationReferralSourceId")
    private EducationReferralSource educationReferralSource;

    @NotNull
    private String clientType;
}
