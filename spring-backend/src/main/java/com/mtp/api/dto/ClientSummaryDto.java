package com.mtp.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClientSummaryDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String gender;
    private String branch;
    private String clientCode;
    
    // We keep the small profile photo (base64) so it can display in avatars
    private String photo; 
    
    private String status;
    private String email;
    private String contactPhone;
    private LocalDateTime registerDate;

    // Display name helper
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
