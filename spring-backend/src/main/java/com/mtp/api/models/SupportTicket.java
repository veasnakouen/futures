package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "SupportTickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status; // Open, In Progress, Resolved, Closed

    private String priority; // Low, Medium, High, Urgent

    private String category; // IT, Facility, HR, Finance

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReporterId", columnDefinition = "nvarchar(450)")
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AssigneeId", columnDefinition = "nvarchar(450)")
    private User assignee;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime resolvedAt;

    private String resolutionNotes;
}
