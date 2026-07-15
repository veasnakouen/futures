package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBranchCommand {
    @NotBlank(message = "Branch name is required")
    private String branchName;
    private String phoneNumber;
    private String email;
    private com.mtp.school.cqrs.dto.AddressDto address;
    private String imageUrl;
}
