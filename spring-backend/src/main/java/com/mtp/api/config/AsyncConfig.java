package com.mtp.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async thread pool configuration.
 *
 * @EnableAsync is already set in ApiApplication.java.
 * This bean gives @Async methods a named, bounded thread pool
 * instead of using the default unbounded SimpleAsyncTaskExecutor.
 *
 * Usage in services:
 *   @Async("asyncExecutor")
 *   public CompletableFuture<Void> doBackgroundWork() { ... }
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "asyncExecutor")
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);          // Always-alive worker threads
        executor.setMaxPoolSize(10);          // Burst capacity
        executor.setQueueCapacity(100);       // Queue up to 100 tasks before rejecting
        executor.setThreadNamePrefix("mtp-async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);  // Graceful shutdown
        executor.initialize();
        return executor;
    }
}
