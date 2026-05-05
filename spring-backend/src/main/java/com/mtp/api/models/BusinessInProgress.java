package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "BusinessInProgresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessInProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MonitoringId")
    private Monitoring monitoring;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BusinessSetUpCategoryId")
    private BusinessSetUpCategory businessSetUpCategory;

    @NotNull
    private String stillInbusiness;

    @NotNull
    @Size(max = 50)
    private String businessType;

    @NotNull
    @Size(max = 50)
    private String expense;

    @NotNull
    @Size(max = 50)
    private String income;

    @Size(max = 255)
    private String note;
}
