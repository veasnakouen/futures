package com.mtp.clinic.cqrs.dto;

import lombok.Data;

@Data
public class PrescriptionItemDto {
    private String id;
    private String drugName;
    private String ndcCode;
    private String dosage;
    private String frequency;
    private String duration;
    private String refillsAllowed;
    private String phamacyId;

    private Long inventoryItemId;
    private Integer quantityDispensed;
}
