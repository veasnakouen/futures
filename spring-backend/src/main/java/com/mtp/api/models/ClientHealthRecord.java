package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "ClientHealthRecords")
@Data
public class ClientHealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "ClientId")
    private Long clientId;

    @Column(name = "BloodType")
    private String bloodType;

    @Column(name = "Height")
    private Double height;

    @Column(name = "Weight")
    private Double weight;

    @Column(name = "Allergies")
    private String allergies;

    @Column(name = "LastCheckupDate")
    private LocalDateTime lastCheckupDate;
    
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();
}
