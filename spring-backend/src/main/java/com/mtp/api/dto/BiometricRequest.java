package com.mtp.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BiometricRequest {
    @NotBlank(message = "Identifier is required")
    private String identifier;    // Staff ID, RFID UID, or Biometric Template ID

    @NotBlank(message = "Scan type is required")
    private String type;          // FINGERPRINT, FACE, RFID, CARD

    @Size(max = 255)
    private String deviceName;    // e.g., "ZKTeco K40", "Front Door Camera"

    @Size(max = 255)
    private String location;      // e.g., "Main Entrance", "HR Office"

    private String metadata;      // Any extra info from the device
}
