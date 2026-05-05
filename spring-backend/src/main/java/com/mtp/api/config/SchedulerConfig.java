package com.mtp.api.config;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Background scheduled jobs for the MTP system.
 *
 * Uses @EnableScheduling (already set via @EnableAsync in ApiApplication).
 * Jobs run in background threads — they never block any HTTP request.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {

    /**
     * Evict all caches daily at 3:00 AM to ensure data freshness.
     * This handles cases where reference data (departments, positions)
     * was changed directly in the DB outside the API.
     */
    @Scheduled(cron = "0 0 3 * * *")
    @CacheEvict(value = {"lookups", "jobCategories", "dashboardStats"}, allEntries = true)
    public void evictStaleCaches() {
        // Caffeine TTL handles most cases, but this is a hard reset safety net
    }

    /**
     * Log a heartbeat every 5 minutes so DevOps can confirm the scheduler
     * thread pool is alive and healthy.
     */
    @Scheduled(fixedDelay = 300_000)
    public void heartbeat() {
        // Using System.out here intentionally — this is a lightweight operational ping
        // Replace with your monitoring/logging framework call if needed
        System.out.println("[SCHEDULER] Heartbeat OK @ " + java.time.LocalDateTime.now());
    }
}
