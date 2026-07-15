package com.mtp.hotel.cqrs.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GuestQueryResultDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String idProofNumber;
    private String address;
    private Boolean isActive;
    private String nationality;
    private LocalDate dateOfBirth;
    private String emergencyContact;
}
