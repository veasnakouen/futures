package com.mtp.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportSummaryDto {
    private String sheetName;
    private Long count;
    private String targetType;
    private LocalDateTime importDate;
}
