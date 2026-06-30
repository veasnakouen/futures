package com.mtp.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportProgress {
    private int total;
    private int processed;
    private String status; // "PENDING", "PROCESSING", "COMPLETED", "FAILED"
    private String message;
    private boolean completed;
    private int errorCount;
}
