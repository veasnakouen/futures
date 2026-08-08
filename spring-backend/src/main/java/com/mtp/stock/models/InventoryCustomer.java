package com.mtp.stock.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "InventoryCustomers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryCustomer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String contactInfo;

    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String contactPerson;

    @Size(max = 50)
    private String phone;

    @Size(max = 500)
    private String address;

    @Size(max = 100)
    private String taxId;

    @Size(max = 50)
    private String status = "ACTIVE";
}
