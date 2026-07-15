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
    private String status; // PENDING_MANAGER, PENDING_CHAIRMAN, APPROVED, REJECTED

    @Size(max = 20)
    private String managerApprovalStatus; // PENDING, APPROVED, REJECTED

    @Size(max = 20)
    private String chairmanApprovalStatus; // PENDING, APPROVED, REJECTED

    private Integer managerId;
    private Integer chairmanId;

    @Size(max = 50)
    private String duration; // FULL_DAY, HALF_MORNING, HALF_AFTERNOON


    @Column(name = "approved_by_manager_id")
    private Integer approvedByManagerId;

    @Column(name = "approved_by_hr_id")
    private Integer approvedByHrId;

    @Column(name = "attachment_url", columnDefinition = "NVARCHAR(MAX)")
    private String attachmentUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Size(max = 255)
    private String adminComment;
}
