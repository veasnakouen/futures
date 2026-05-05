package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "LeaveRequests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @Size(max = 50)
    private String leaveType; // Annual, Sick, Personal, etc.

    @Size(max = 255)
    private String reason;

    @Size(max = 20)
    private String status; // Pending, Approved, Rejected

    private LocalDateTime createdAt = LocalDateTime.now();

    @Size(max = 255)
    private String adminComment;
}
