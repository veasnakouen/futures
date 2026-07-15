package com.mtp.clinic.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
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

    @Column(name = "drug_name")
    private String drugName;
    @Column(name = "ndc_code")
    private String ndcCode;
    private String dosage;
    private String frequency;
    private String duration;
    @Column(name = "refills_allowed")
    private String refillsAllowed;
    @Column(name = "pharmacy_id")
    private String phamacyId;

    // Fields to link to mtp-stock-service for real-time inventory tracking
    @Column(name = "inventory_item_id")
    private Long inventoryItemId;
    @Column(name = "quantity_dispensed")
    private Integer quantityDispensed;
}
