package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "ClientFamilyMembers")
@Data
public class ClientFamilyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "ClientId")
    private Long clientId;

    @Column(name = "Name")
    private String name;

    @Column(name = "Relationship")
    private String relationship;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Occupation")
    private String occupation;

    @Column(name = "ContactPhone")
    private String contactPhone;

    @Column(name = "IsPrimaryCarer")
    private Boolean isPrimaryCarer;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();
}
