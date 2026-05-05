package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "ComputerSkills")
@Data
public class ComputerSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "ClientId")
    private Integer clientId;

    @Size(max = 255)
    @Column(name = "Skill")
    private String skill;

    @Size(max = 255)
    @Column(name = "Level")
    private String level;

    @Size(max = 255)
    @Column(name = "Certified")
    private String certified;

    @Column(name = "Description")
    private String description;
}
