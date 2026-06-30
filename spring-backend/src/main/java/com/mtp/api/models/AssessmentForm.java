package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "AssessmentForms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketId;

    private String requesterName;
    private String department;

    private String brand;
    private String model;
    private String itemCode;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String issueDescription;

    private LocalDate assessmentDate = LocalDate.now();

    @OneToMany(mappedBy = "assessmentForm", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<AssessmentFormItem> items = new ArrayList<>();

    // Helpers to manage bidirectional relationships
    public void addItem(AssessmentFormItem item) {
        items.add(item);
        item.setAssessmentForm(this);
    }
    public void removeItem(AssessmentFormItem item) {
        items.remove(item);
        item.setAssessmentForm(null);
    }
}
