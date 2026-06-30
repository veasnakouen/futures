package com.mtp.clinic.cqrs.dto;

import lombok.Data;

@Data
public class AddressDto {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
