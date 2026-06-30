package com.mtp.api.config;

import com.mtp.api.services.DatabaseBackupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;

@Configuration
@Slf4j
public class DynamicBackupScheduler implements SchedulingConfigurer {

    @Autowired
    private DatabaseBackupService databaseBackupService;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.addTriggerTask(
                () -> {
                    try {
                        String type = databaseBackupService.getSetting("backup.schedule.type", "full");
                        log.info("Running scheduled automated database backup (Type: {})", type);
                        databaseBackupService.runBackup(type);
                    } catch (Exception e) {
                        log.error("Automated scheduled backup failed: ", e);
                    }
                },
                triggerContext -> {
                    String enabledStr = databaseBackupService.getSetting("backup.schedule.enabled", "false");
                    boolean enabled = "true".equalsIgnoreCase(enabledStr) || "1".equals(enabledStr);
                    
                    if (!enabled) {
                        return null; // Do not schedule if disabled
                    }

                    // Default to midnight every day if not set: "0 0 0 * * ?"
                    String cron = databaseBackupService.getSetting("backup.schedule.cron", "0 0 0 * * ?");
                    try {
                        java.util.Date next = new CronTrigger(cron).nextExecutionTime(triggerContext);
                        return next != null ? next.toInstant() : null;
                    } catch (IllegalArgumentException e) {
                        log.error("Invalid cron expression for backup: {}", cron);
                        return null;
                    }
                }
        );
    }
}
