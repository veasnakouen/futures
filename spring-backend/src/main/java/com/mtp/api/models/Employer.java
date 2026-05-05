package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Employers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobCategoryId")
    private JobCategory jobCategory;

    @Size(max = 510)
    private String address;

    @NotNull
    @Size(max = 255)
    private String contactPerson;

    @Size(max = 255)
    private String contactPhone;

    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String website;

    @Size(max = 510)
    private String note;

    @Size(max = 255)
    private String branch;

    private LocalDateTime corporateDate;

    private String status;

    private String logoUrl;
}
