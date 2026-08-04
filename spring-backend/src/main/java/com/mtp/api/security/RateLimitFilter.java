package com.mtp.api.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting filter using Bucket4j (token bucket algorithm).
 * Registered in SecurityConfig as the first filter in the chain.
 *
 * Rules per IP:
 * - /api/auth/login → 10 attempts / minute (brute-force protection)
 * - /api/reports/** → 5 requests / minute (expensive RDLC endpoints)
 * - Everything else → 120 requests / minute (general throttle)
 */
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private com.mtp.api.services.LoginHistoryService loginHistoryService;

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> reportBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

    private Bucket createLoginBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1))))
                .build();
    }

    private Bucket createReportBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(60, Refill.intervally(60, Duration.ofMinutes(1))))
                .build();
    }

    private Bucket createGeneralBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(1000, Refill.intervally(1000, Duration.ofMinutes(1))))
                .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        String ip = getClientIp(request);
        String path = request.getRequestURI();

        // Bypass rate limiting for localhost / gateway internal routing
        if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.equals("::1") || ip.equals("::ffff:127.0.0.1")
                || ip.equals("localhost")) {
            chain.doFilter(request, response);
            return;
        }

        evictIfOverfilled(loginBuckets);
        evictIfOverfilled(reportBuckets);
        evictIfOverfilled(generalBuckets);

        Bucket bucket;
        if (path.startsWith("/api/auth/login")) {
            bucket = loginBuckets.computeIfAbsent(ip, k -> createLoginBucket());
        } else if (path.startsWith("/api/reports")) {
            bucket = reportBuckets.computeIfAbsent(ip, k -> createReportBucket());
        } else {
            bucket = generalBuckets.computeIfAbsent(ip, k -> createGeneralBucket());
        }

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded: IP={} PATH={}", ip, path);
            loginHistoryService.recordEvent("Rate Limit Exceeded", "Suspicious", "API Access (25KB)", request);
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"status\":429,\"error\":\"Too Many Requests\"," +
                            "\"message\":\"Rate limit exceeded. Please slow down.\",\"path\":\"" + path + "\"}");
        }
    }

    private void evictIfOverfilled(Map<String, Bucket> map) {
        if (map.size() > 5000) {
            map.clear();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
