package com.mtp.api.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserDto {
    private String id;
    private String firstName;
    private String lastName;
    private String branch;
    private String email;
    private String userName;
    private String password;
    private String avatarUrl;
    private Set<String> roles;
}
