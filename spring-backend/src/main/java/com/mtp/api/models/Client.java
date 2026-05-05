package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "Clients", indexes = {
    @Index(name = "idx_client_code", columnList = "ClientCode"),
    @Index(name = "idx_client_status", columnList = "Status")
})
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Size(max = 255)
    @Column(name = "Branch")
    private String branch;

    @NotNull
    @Size(max = 255)
    @Column(name = "FirstName")
    private String firstName;

    @NotNull
    @Size(max = 255)
    @Column(name = "LastName")
    private String lastName;

    @Size(max = 6)
    @Column(name = "Gender")
    private String gender;

    @Column(name = "DateOfBirth")
    private LocalDateTime dateOfBirth;

    @Size(max = 255)
    @Column(name = "ContactPhone")
    private String contactPhone;

    @Size(max = 255)
    @Column(name = "RelativePhone")
    private String relativePhone;

    @Size(max = 10)
    @Column(name = "MaritalStatus")
    private String maritalStatus;

    @Size(max = 255)
    @Column(name = "Email")
    private String email;

    @Size(max = 255)
    @Column(name = "Address")
    private String address;

    @Size(max = 255)
    @Column(name = "Province")
    private String province;

    @Column(name = "Photo", columnDefinition = "NVARCHAR(MAX)")
    private String photo;

    @Size(max = 255)
    @Column(name = "IdCard")
    private String idCard;

    @Size(max = 255)
    @Column(name = "CurrentSituation")
    private String currentSituation;

    @Column(name = "FurtherEducation")
    private boolean furtherEducation;

    @Column(name = "Placement")
    private boolean placement;

    @Column(name = "TrainingFromFutures")
    private boolean trainingFromFutures;

    @Column(name = "SocialSupportRequired")
    private boolean socialSupportRequired;

    @Size(max = 255)
    @Column(name = "HearBy")
    private String hearBy;

    @Size(max = 255)
    @Column(name = "ExpectedSupport")
    private String expectedSupport;

    @NotNull
    @Column(name = "AspUserId")
    private String aspUserId;

    @NotNull
    @Size(max = 50)
    @Column(name = "ClientCode")
    private String clientCode;

    @Column(name = "RegisterDate")
    private LocalDateTime registerDate;
    
    @Column(name = "RegisterDateNd")
    private LocalDateTime registerDateNd;
    
    @Column(name = "RegisterDateRd")
    private LocalDateTime registerDateRd;

    @Column(name = "EnrollDate")
    private LocalDateTime enrollDate;
    
    @Column(name = "UpdateDate")
    private LocalDateTime updateDate;
    
    @Column(name = "PlaceOfBirth")
    private String placeOfBirth;
    
    @Column(name = "Nationality")
    private String nationality;
    
    @Column(name = "Citizenship")
    private String citizenship;
    
    @Column(name = "Height")
    private String height;
    
    @Column(name = "Weight")
    private String weight;
    
    @Column(name = "UpdateBy")
    private String updateBy;
    
    @Column(name = "SocialSupportProblem")
    private String socialSupportProblem;

    @Size(max = 50)
    @Column(name = "IdpoorStatus")
    private String idpoorStatus;

    @Column(name = "IdpoorValiddate")
    private LocalDateTime idpoorValiddate;
    
    @Column(name = "IdpoorLevel")
    private String idpoorLevel;

    @Size(max = 255)
    @Column(name = "IdpoorAccountNumber")
    private String idpoorAccountNumber;

    @Size(max = 255)
    @Column(name = "Status")
    private String status;
}
