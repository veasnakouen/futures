package com.mtp.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BiometricRequest {
    private String identifier;    // Staff ID, RFID UID, or Biometric Template ID
    private String type;          // FINGERPRINT, FACE, RFID, CARD
    private String deviceName;    // e.g., "ZKTeco K40", "Front Door Camera"
    private String location;      // e.g., "Main Entrance", "HR Office"
    private String metadata;      // Any extra info from the device
}
