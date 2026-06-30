package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "BiometricDevices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BiometricDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 50)
    private String ipAddress;

    @NotNull
    private Integer port;

    @Size(max = 100)
    private String location;

    @Size(max = 20)
    private String status; // Online, Offline, Connecting

    private LocalDateTime lastSync;

    @Version
    private Integer version;
}
