package com.mtp.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTenantCommand {
    @NotBlank(message = "ID is required")
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    private String managerEmail;

    @NotNull(message = "IsActive is required")
    private Boolean isActive;

    private LocalDate subscriptionEndDate;

    @NotNull(message = "MaxDevices is required")
    private Integer maxDevices;

    @Builder.Default
    private List<String> allowedModules = new ArrayList<>();
}
