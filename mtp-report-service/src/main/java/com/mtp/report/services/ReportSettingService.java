package com.mtp.report.services;

import com.mtp.report.models.ReportSetting;
import com.mtp.report.repositories.ReportSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReportSettingService {

    private final ReportSettingRepository repository;

    @Autowired
    public ReportSettingService(ReportSettingRepository repository) {
        this.repository = repository;
    }

    public ReportSetting getSettings(String userId, String reportName) {
        return repository.findByUserIdAndReportName(userId, reportName)
                .orElseGet(() -> {
                    ReportSetting defaultSetting = new ReportSetting();
                    defaultSetting.setUserId(userId);
                    defaultSetting.setReportName(reportName);
                    defaultSetting.setPreferences("{}");
                    return defaultSetting;
                });
    }

    public ReportSetting saveSettings(String userId, String reportName, String preferencesJson) {
        ReportSetting setting = repository.findByUserIdAndReportName(userId, reportName)
                .orElse(new ReportSetting());
        
        setting.setUserId(userId);
        setting.setReportName(reportName);
        setting.setPreferences(preferencesJson);
        
        return repository.save(setting);
    }

    public java.util.List<ReportSetting> getCustomReports(String userId) {
        return repository.findByUserIdAndReportNameStartingWith(userId, "custom_report_");
    }
}
