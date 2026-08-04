package com.mtp.api.dtos;

import java.util.List;

public class UserLinkDTO {
    public String id;
    public String firstName;
    public String lastName;
    public String email;
    public String avatarUrl;
    public String userName;
    public List<String> roles;

    public UserLinkDTO(String id, String firstName, String lastName, String email,
            String avatarUrl, String userName, List<String> roles) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.userName = userName;
        this.roles = roles;
    }
}
