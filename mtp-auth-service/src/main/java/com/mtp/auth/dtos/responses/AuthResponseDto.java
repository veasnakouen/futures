package com.mtp.auth.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDto {
    private String token;
    private String refreshToken;
    private String username;
    private String email;
    private List<String> roles;
    private String tenantType;
    private List<String> allowedModules;
}
