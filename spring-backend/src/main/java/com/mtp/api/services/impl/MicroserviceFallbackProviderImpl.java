package com.mtp.api.services.impl;

import com.mtp.api.services.MicroserviceFallbackProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class MicroserviceFallbackProviderImpl implements MicroserviceFallbackProvider {

    private final RestTemplate resilientRestTemplate;

    @Override
    public Map<String, Object> executeWithFallback(String serviceName, String endpointUrl, Map<String, Object> defaultFallback) {
        try {
            log.debug("Calling downstream microservice [{}] at endpoint: {}", serviceName, endpointUrl);
            Map<String, Object> response = resilientRestTemplate.getForObject(endpointUrl, Map.class);
            if (response != null) {
                response.put("isFallback", false);
                return response;
            }
        } catch (Exception e) {
            log.warn("Microservice [{}] at {} unavailable: {}. Engaging circuit breaker fallback layer.", serviceName, endpointUrl, e.getMessage());
        }

        Map<String, Object> fallback = defaultFallback != null ? new HashMap<>(defaultFallback) : new HashMap<>();
        fallback.put("isFallback", true);
        fallback.put("fallbackReason", "Downstream microservice " + serviceName + " unavailable");
        fallback.put("timestamp", System.currentTimeMillis());
        return fallback;
    }

    @Override
    public boolean isServiceHealthy(String serviceUrl) {
        try {
            resilientRestTemplate.getForObject(serviceUrl + "/actuator/health", String.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
