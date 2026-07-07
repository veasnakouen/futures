package com.mtp.auth.services;

import com.mtp.auth.models.Tenant;
import com.mtp.auth.repositories.TenantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TenantLifecycleScheduler {

    private static final Logger log = LoggerFactory.getLogger(TenantLifecycleScheduler.class);
    
    private final TenantRepository tenantRepository;
    private final EmailNotificationService emailNotificationService;

    public TenantLifecycleScheduler(TenantRepository tenantRepository, EmailNotificationService emailNotificationService) {
        this.tenantRepository = tenantRepository;
        this.emailNotificationService = emailNotificationService;
    }

    // Run daily at midnight: 0 0 0 * * ?
    // Also running every minute for testing: 0 * * * * ?
    @Scheduled(cron = "0 * * * * ?") 
    @Transactional
    public void processTenantLifecycles() {
        log.info("--- Starting Tenant Lifecycle Automation Check ---");
        LocalDate today = LocalDate.now();

        // 1. Check for Expired Subscriptions (To Suspend)
        List<Tenant> expiredTenants = tenantRepository.findByIsActiveTrueAndSubscriptionEndDateBefore(today);
        for (Tenant tenant : expiredTenants) {
            log.info("Suspending Tenant: {} (ID: {}) - Subscription expired on {}", tenant.getName(), tenant.getId(), tenant.getSubscriptionEndDate());
            tenant.setIsActive(false);
            tenantRepository.save(tenant);
            emailNotificationService.sendSuspensionEmail(tenant.getManagerEmail(), tenant.getName());
        }

        // 2. Check for 7-Day Warnings
        LocalDate inSevenDays = today.plusDays(7);
        List<Tenant> warning7Tenants = tenantRepository.findByIsActiveTrueAndSubscriptionEndDate(inSevenDays);
        for (Tenant tenant : warning7Tenants) {
            log.info("7-Day Warning for Tenant: {} (ID: {})", tenant.getName(), tenant.getId());
            emailNotificationService.sendWarningEmail(tenant.getManagerEmail(), tenant.getName(), 7);
        }

        // 3. Check for 3-Day Warnings
        LocalDate inThreeDays = today.plusDays(3);
        List<Tenant> warning3Tenants = tenantRepository.findByIsActiveTrueAndSubscriptionEndDate(inThreeDays);
        for (Tenant tenant : warning3Tenants) {
            log.info("3-Day Warning for Tenant: {} (ID: {})", tenant.getName(), tenant.getId());
            emailNotificationService.sendWarningEmail(tenant.getManagerEmail(), tenant.getName(), 3);
        }

        log.info("--- Finished Tenant Lifecycle Automation Check ---");
    }
}
