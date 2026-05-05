package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "Educations")
@Data
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId", insertable = false, updatable = false)
    private Client client;

    @NotNull
    @Column(name = "ClientId")
    private Integer clientId;

    @Size(max = 255)
    @Column(name = "Level")
    private String level;

    @Size(max = 255)
    @Column(name = "Grade")
    private String grade;

    @Size(max = 255)
    @Column(name = "Subject")
    private String subject;

    @Size(max = 255)
    @Column(name = "Year")
    private String year;

    @Size(max = 255)
    @Column(name = "SchoolName")
    private String schoolName;

    @Column(name = "Description")
    private String description;
}
