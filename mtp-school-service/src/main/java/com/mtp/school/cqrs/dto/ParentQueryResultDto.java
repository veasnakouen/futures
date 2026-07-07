package com.mtp.school.cqrs.dto;

import lombok.Data;

@Data
public class ParentQueryResultDto {
    private String id;
    private String name;
    private String contactNumber;
    private String email;
    private com.mtp.school.models.Gender gender;
    private AddressDto address;
    private String imageUrl;
}
