package com.mtp.stock.projections;

import java.time.LocalDateTime;

public interface AssetProjection {
    Integer getId();

    String getName();

    String getSerialNumber();

    String getAssetType();

    String getStatus();

    String getImageUrl();

    LocalDateTime getAssignedDate();

    EmployeeSummary getEmployee();

    interface EmployeeSummary {
        Integer getId();

        String getFirstNameEnglish();

        String getLastNameEnglish();
        // Skip photo to keep payload small
    }
}
