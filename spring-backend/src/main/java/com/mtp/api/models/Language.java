package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "Languages")
@Data
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "ClientId")
    private Integer clientId;

    @Size(max = 255)
    @Column(name = "Name")
    private String name;

    @Size(max = 255)
    @Column(name = "Level")
    private String level;
}
