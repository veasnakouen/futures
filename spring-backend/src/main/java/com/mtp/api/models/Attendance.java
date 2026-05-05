package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    @NotNull
    private LocalDateTime clockIn;

    private LocalDateTime clockOut;

    @Size(max = 255)
    private String location;

    @Size(max = 255)
    private String note;

    @Size(max = 20)
    private String status; // Present, Late, Early Leave

    @Version
    private Integer version;
}
