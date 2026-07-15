package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "EmployeeAssets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    private String assetName;

    private String assetTag;
    private String serialNumber;

    private LocalDate assignedDate;
    private LocalDate returnDate;
    private String status; // Assigned, Returned, Lost

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    @JsonBackReference
    private Employee employee;
}
