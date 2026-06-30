package com.mtp.school.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import com.mtp.school.cqrs.dto.AddressDto;

@Data
public class CreateParentCommand {
    @NotBlank(message = "Name is required") private String name;
    private String contactNumber;
    private String email;
    private com.mtp.school.models.Gender gender;
    private AddressDto address;
}
