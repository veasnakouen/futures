package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "ExpectedSupportOptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpectedSupportOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotBlank
    @Size(max = 255)
    @Column(name = "Name")
    private String name;
}
