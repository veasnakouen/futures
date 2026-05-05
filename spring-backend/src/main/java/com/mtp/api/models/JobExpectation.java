package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "JobExpectations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobExpectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer clientId;

    private Integer jobCategoryIdOne;
    private Integer jobCategoryIdTwo;
    private Integer jobCategoryIdThree;

    private Integer jobPositionIdOne;
    private Integer jobPositionIdTwo;
    private Integer jobPositionIdThree;

    private boolean permanent;
    private boolean temporary;
    private boolean seasonal;

    @Size(max = 255)
    private String employmentType;

    @Size(max = 255)
    private String availableTime;

    @Size(max = 255)
    private String salaryExpectation;

    @Size(max = 510)
    private String note;

    private String candidate;
    private String hobby;
    private String selfEmployment;
    private Integer businessSetUpCategoryId;
    private String businessType;

    @Size(max = 50)
    private String expectationStatus;
}
