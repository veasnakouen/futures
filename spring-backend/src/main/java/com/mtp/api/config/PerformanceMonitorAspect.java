package com.mtp.api.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * AOP-based performance monitor.
 *
 * Automatically times every controller method. If a request takes
 * longer than 500ms it logs a WARNING so you can identify slow endpoints.
 *
 * Requires: spring-boot-starter-aop (included transitively via spring-boot-starter-web)
 */
@Aspect
@Component
@Slf4j
public class PerformanceMonitorAspect {

    private static final long SLOW_THRESHOLD_MS = 500;

    @Around("execution(* com.mtp.api.controllers.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        long duration = System.currentTimeMillis() - start;

        String method = pjp.getSignature().toShortString();

        if (duration > SLOW_THRESHOLD_MS) {
            log.warn("SLOW_API | {} | {}ms — consider adding @Cacheable or pagination", method, duration);
        } else {
            log.debug("API_OK   | {} | {}ms", method, duration);
        }

        return result;
    }
}
