package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "JobExperiences")
@Data
public class JobExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "ClientId")
    private Integer clientId;

    @Size(max = 255)
    @Column(name = "Employer")
    private String employer;

    @Size(max = 255)
    @Column(name = "Duration")
    private String duration;

    @Column(name = "Description")
    private String description;
}
