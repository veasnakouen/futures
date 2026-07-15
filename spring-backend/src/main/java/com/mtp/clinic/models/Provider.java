package com.mtp.clinic.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.EqualsAndHashCode;

@Entity
@Table(name = "clinic_doctors")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Provider extends Staff {

    @Column(name = "license_number")
    private String licenseNumber;
    
    @Column(name = "year_of_experience")
    private Integer yearOfExperience;
    
    @Column(name = "npi_number")
    private String npiNumber;
    
    @Column(name = "consultation_fee")
    private Double consultationFee;
    
}
