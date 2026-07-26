package com.mtp.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String oldPassword;

    @NotNull(message = "New password cannot be null")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
}
