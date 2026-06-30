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

    private String licenseNumber;
    private Integer yearOfExperience;
    private String npiNumber;
    private Double consultationFee;
    
}
