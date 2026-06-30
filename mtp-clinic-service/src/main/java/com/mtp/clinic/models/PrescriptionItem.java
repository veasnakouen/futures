package com.mtp.clinic.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "clinic_prescription_items")
public class PrescriptionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "prescription_id")
    @JsonIgnore
    private Prescription prescription;

    private String drugName;
    private String ndcCode;
    private String dosage;
    private String frequency;
    private String duration;
    private String refillsAllowed;
    private String phamacyId;
}
