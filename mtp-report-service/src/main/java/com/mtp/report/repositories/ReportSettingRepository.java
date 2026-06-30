package com.mtp.report.repositories;

import com.mtp.report.models.ReportSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportSettingRepository extends JpaRepository<ReportSetting, Long> {
    Optional<ReportSetting> findByUserIdAndReportName(String userId, String reportName);
    
    // Fetch all custom saved reports for a user
    java.util.List<ReportSetting> findByUserIdAndReportNameStartingWith(String userId, String prefix);
}
