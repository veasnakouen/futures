package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "BusinessSetUps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSetUp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BusinessSetUpCategoryId")
    private BusinessSetUpCategory businessSetUpCategory;

    @NotNull
    @Size(max = 255)
    private String businessType;

    @NotNull
    @Size(max = 255)
    private String income;

    @NotNull
    @Size(max = 255)
    private String expense;

    @NotNull
    @Size(max = 255)
    private String countTime;

    private String jobPlaceBy;

    private LocalDateTime startBusinessSetUpDate;
}
