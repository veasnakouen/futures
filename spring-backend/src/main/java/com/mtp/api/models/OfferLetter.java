package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "OfferLetters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferLetter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id")
    @JsonBackReference
    private JobApplication jobApplication;

    private Double offeredSalary;
    private String currency; // USD or KHR
    
    @Column(columnDefinition = "TEXT")
    private String termsAndConditions;

    private LocalDateTime validUntil;
    private LocalDateTime generatedAt;

    private String status; // PENDING_SIGNATURE, ACCEPTED, DECLINED, EXPIRED

    private String signaturePath; // E-signature hash or path to signed PDF
}
