package com.mtp.stock.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Medications")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Medication extends InventoryItem {
    
    @jakarta.persistence.Column(name = "generic_name")
    private String genericName;
    
    @jakarta.persistence.Column(name = "dosage")
    private String dosage;
    
    @jakarta.persistence.Column(name = "active_ingredient")
    private String activeIngredient;
    
    @jakarta.persistence.Column(name = "is_prescription_required")
    private Boolean isPrescriptionRequired;
    
    @jakarta.persistence.Column(name = "storage_temperature_range")
    private String storageTemperatureRange;
    
    @jakarta.persistence.Column(name = "medical_category")
    private String medicalCategory;
}
