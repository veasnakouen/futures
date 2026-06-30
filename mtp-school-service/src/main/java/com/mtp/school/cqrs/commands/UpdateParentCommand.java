package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateParentCommand {
    private String id;
    @NotBlank(message = "Name is required") private String name;
    private String contactNumber;
    private String email;
    private com.mtp.school.models.Gender gender;
    private com.mtp.school.cqrs.dto.AddressDto address;
}
