package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "FurtherEducations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FurtherEducation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    private Client client;

    private boolean university;
    private boolean publicSchool;
    private boolean vocationalTraining;
    private boolean computerSchool;
    private boolean englishSchool;
    private boolean chineseSchool;

    @Size(max = 255)
    private String availableTime;
}
