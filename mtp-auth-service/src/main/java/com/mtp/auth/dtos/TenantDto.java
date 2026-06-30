package com.mtp.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantDto {
    private String id;
    private String name;
    private String managerEmail;
    private Boolean isActive;
    private LocalDate subscriptionEndDate;
    private Integer maxDevices;
    @Builder.Default
    private List<String> allowedModules = new ArrayList<>();
    private LocalDateTime createdAt;
}
