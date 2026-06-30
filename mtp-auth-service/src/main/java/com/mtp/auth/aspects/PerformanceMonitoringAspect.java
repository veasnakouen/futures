package com.mtp.auth.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PerformanceMonitoringAspect {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);

    // Matches any handle method inside classes ending with CommandHandler or QueryHandler in the cqrs or handlers packages
    @Around("execution(* com.mtp.auth..*CommandHandler.handle(..)) || execution(* com.mtp.auth..*QueryHandler.handle(..))")
    public Object monitorTimeAndSpaceComplexity(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();

        // 1. Measure initial state
        long startTime = System.currentTimeMillis();
        long startMemory = getUsedMemory();

        // 2. Execute the handler
        Object result = joinPoint.proceed();

        // 3. Measure final state
        long endTime = System.currentTimeMillis();
        long endMemory = getUsedMemory();

        // 4. Calculate complexity
        long timeTaken = endTime - startTime;
        long memoryUsed = endMemory - startMemory;

        logger.info("CQRS Performance Metrics [{}]: Time Complexity = {} ms | Space Complexity (Allocated) = {} bytes",
                methodName, timeTaken, memoryUsed > 0 ? memoryUsed : 0);

        return result;
    }

    private long getUsedMemory() {
        Runtime runtime = Runtime.getRuntime();
        return runtime.totalMemory() - runtime.freeMemory();
    }
}
