package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "SuccessionPipelines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuccessionPipeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String roleName;

    private String criticalLevel; // Critical, High, Medium, Low

    private Integer successorsCount;

    private Boolean isCovered;

    private String readinessStatus; // Ready Now, 1-2 Years, 3+ Years, None
}
