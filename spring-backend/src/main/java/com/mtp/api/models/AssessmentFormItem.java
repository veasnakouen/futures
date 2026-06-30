package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "AssessmentFormItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentFormItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String unitType;
    private Integer quantity;
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AssessmentFormId")
    @JsonBackReference
    private AssessmentForm assessmentForm;
}
