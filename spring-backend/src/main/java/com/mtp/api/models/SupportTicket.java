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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ReporterId", columnDefinition = "nvarchar(128)")
    private User reporter;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "ticket_assignees",
        joinColumns = @JoinColumn(name = "ticket_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id", columnDefinition = "nvarchar(128)")
    )
    private java.util.Set<User> assignees = new java.util.HashSet<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime resolvedAt;

    private String resolutionNotes;

    private LocalDateTime assignedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AssignedById", columnDefinition = "nvarchar(128)")
    private User assignedBy;

    @Column(columnDefinition = "TEXT")
    private String assignNote;
}
