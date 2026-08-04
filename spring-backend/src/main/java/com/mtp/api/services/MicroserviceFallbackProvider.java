package com.mtp.api.services;

import java.util.Map;

public interface MicroserviceFallbackProvider {
    Map<String, Object> executeWithFallback(String serviceName, String endpoint, Map<String, Object> defaultFallback);
    boolean isServiceHealthy(String serviceUrl);
}
