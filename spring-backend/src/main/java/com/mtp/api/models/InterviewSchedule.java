package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "InterviewSchedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id")
    @JsonBackReference
    private JobApplication jobApplication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id")
    private Employee interviewer;

    private LocalDateTime scheduledAt;
    
    @NotBlank
    private String locationOrLink;

    @NotBlank
    private String interviewType; // e.g., Technical, HR, Final

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer rating; // 1-5
    
    private String status; // SCHEDULED, COMPLETED, CANCELLED
}
