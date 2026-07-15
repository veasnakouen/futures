package com.mtp.stock.cqrs.commands;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAssetCommand {
    private Integer id;

    @NotBlank(message = "Asset name is required")
    private String name;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Asset type is required")
    private String assetType;

    @NotBlank(message = "Status is required")
    private String status;

    private String imageUrl;
}
