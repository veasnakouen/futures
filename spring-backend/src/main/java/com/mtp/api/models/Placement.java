package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "Placements")
@Data
public class Placement {
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobPositionId", insertable = false, updatable = false)
    private JobPosition jobPosition;

    @Column(name = "JobPositionId")
    private Integer jobPositionId;

    @Column(name = "PlacementDate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime placementDate;

    @Size(max = 255)
    @Column(name = "PlacementType")
    private String placementType;

    @Size(max = 255)
    @Column(name = "CountedTime")
    private String countedTime;

    @Size(max = 255)
    @Column(name = "CompanyName")
    private String companyName;

    @Size(max = 255)
    @Column(name = "Salary")
    private String salary;

    @Size(max = 20)
    @Column(name = "Status")
    private String status;

    @Size(max = 500)
    @Column(name = "ImageUrl")
    private String imageUrl;
}
