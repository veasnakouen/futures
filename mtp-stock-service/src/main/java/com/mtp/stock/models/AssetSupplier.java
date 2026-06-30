package com.mtp.stock.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "AssetSuppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetSupplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 255)
    @Column(unique = true)
    private String name;

    @Size(max = 255)
    private String contactInfo;
}
