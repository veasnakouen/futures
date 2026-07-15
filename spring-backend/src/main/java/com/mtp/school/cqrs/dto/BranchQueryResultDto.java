package com.mtp.school.cqrs.dto;

import lombok.Data;

@Data
public class BranchQueryResultDto {
    private String id;
    private String branchName;
    private AddressDto address;
    private String phoneNumber;
    private String email;
    private String imageUrl;
}
