package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "LogBooks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(max = 6)
    private String gender;

    @Size(max = 50)
    private String phone;

    @Size(max = 256)
    private String note;

    private boolean jobinformation;
    private boolean library;
    private boolean usingComputer;
    private boolean futureService;
    private boolean interviewTechic;
    private boolean shortTraining;

    @Column(name = "[user]")
    private String user;
    private LocalDateTime enrollDate;
}
