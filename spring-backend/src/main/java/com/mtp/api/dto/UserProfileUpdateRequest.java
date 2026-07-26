package com.mtp.api.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String firstName;
    private String lastName;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String branch;
    private String photo;
}
