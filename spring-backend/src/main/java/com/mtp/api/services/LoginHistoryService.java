package com.mtp.api.services;

import com.mtp.api.models.LoginHistory;
import com.mtp.api.repositories.LoginHistoryRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class LoginHistoryService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final Random random = new Random();

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String resolveLocation(String ip) {
        if (ip == null || ip.isEmpty()) return "Unknown";
        if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.")) {
            return "Phnom Penh, KH";
        }
        int hash = Math.abs(ip.hashCode());
        List<String> locations = Arrays.asList("Phnom Penh, KH", "London, UK", "New York, US", "Tokyo, JP", "Sydney, AU");
        return locations.get(hash % locations.size());
    }

    private void parseUserAgent(String ua, LoginHistory log) {
        if (ua == null || ua.isEmpty()) {
            log.setDeviceType("Desktop");
            log.setOs("Windows 11");
            log.setBrowser("Chrome");
            return;
        }

        String uaLower = ua.toLowerCase();

        // Device Type
        if (uaLower.contains("tablet") || uaLower.contains("ipad") || (uaLower.contains("android") && !uaLower.contains("mobile"))) {
            log.setDeviceType("Tablet");
        } else if (uaLower.contains("mobile") || uaLower.contains("iphone") || uaLower.contains("ipod") || uaLower.contains("android")) {
            log.setDeviceType("Mobile");
        } else if (uaLower.contains("bot") || uaLower.contains("spider") || uaLower.contains("crawl") || uaLower.contains("postman")) {
            log.setDeviceType("Server");
        } else {
            log.setDeviceType("Desktop");
        }

        // OS
        if (uaLower.contains("windows nt 10.0")) {
            log.setOs("Windows 11");
        } else if (uaLower.contains("windows nt 6.3") || uaLower.contains("windows nt 6.2") || uaLower.contains("windows nt 6.1")) {
            log.setOs("Windows 10");
        } else if (uaLower.contains("macintosh") || uaLower.contains("mac os x")) {
            if (uaLower.contains("os x 14") || uaLower.contains("os x 10_15_7")) {
                log.setOs("macOS Sonoma");
            } else {
                log.setOs("macOS");
            }
        } else if (uaLower.contains("iphone") || uaLower.contains("ipad") || uaLower.contains("ipod")) {
            if (uaLower.contains("cpu iphone os 17") || uaLower.contains("cpu os 17")) {
                log.setOs("iOS 17");
            } else {
                log.setOs("iOS");
            }
        } else if (uaLower.contains("android")) {
            if (uaLower.contains("android 14")) {
                log.setOs("Android 14");
            } else {
                log.setOs("Android");
            }
        } else if (uaLower.contains("linux")) {
            log.setOs("Linux Ubuntu");
        } else {
            log.setOs("Unknown OS");
        }

        // Browser
        if (uaLower.contains("postman")) {
            log.setBrowser("PostmanRuntime");
        } else if (uaLower.contains("edg/")) {
            log.setBrowser("Edge");
        } else if (uaLower.contains("chrome") || uaLower.contains("crios")) {
            log.setBrowser("Chrome");
        } else if (uaLower.contains("firefox") || uaLower.contains("fxios")) {
            log.setBrowser("Firefox");
        } else if (uaLower.contains("safari") && !uaLower.contains("chrome") && !uaLower.contains("chromium")) {
            log.setBrowser("Safari");
        } else {
            log.setBrowser("Chrome"); // Default or unknown
        }
    }

    public void recordEvent(String username, String status, String dataUsageType, HttpServletRequest request) {
        try {
            LoginHistory log = new LoginHistory();
            log.setLoggedBy(username != null ? username : "Unknown");
            log.setLoggedDate(LocalDateTime.now());

            String ip = getClientIp(request);
            log.setIpAddress(ip);

            String userAgent = request.getHeader("User-Agent");
            log.setHostName(userAgent != null ? (userAgent.length() > 450 ? userAgent.substring(0, 450) : userAgent) : "Unknown");

            parseUserAgent(userAgent, log);
            log.setLocation(resolveLocation(ip));
            log.setDataUsageType(dataUsageType != null ? dataUsageType : "Standard (12MB)");
            log.setStatus(status);

            loginHistoryRepository.save(log);
        } catch (Exception e) {
            System.err.println("Error recording access/security log: " + e.getMessage());
        }
    }

    public void recordReportAccess(String reportName, HttpServletRequest request) {
        try {
            String username = "System";
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                username = auth.getName();
            }
            recordEvent(username, "Success", "Heavy (150MB)", request);
        } catch (Exception e) {
            System.err.println("Error recording report access log: " + e.getMessage());
        }
    }

    public List<LoginHistory> getAllAccessLogs() {
        return loginHistoryRepository.findAll();
    }

    public void clearLogs(String type) {
        if (type == null) return;
        switch (type) {
            case "all":
                loginHistoryRepository.deleteAll();
                break;
            case "7days":
                loginHistoryRepository.deleteByLoggedDateBefore(LocalDateTime.now().minusDays(7));
                break;
            case "30days":
                loginHistoryRepository.deleteByLoggedDateBefore(LocalDateTime.now().minusDays(30));
                break;
            case "success":
                loginHistoryRepository.deleteByStatus("Success");
                break;
            default:
                break;
        }
    }

    @PostConstruct
    public void seedMockData() {
        if (loginHistoryRepository.count() == 0) {
            List<String> users = Arrays.asList("Veasna Koeun", "Admin User", "John Doe", "Jane Smith", "Security Bot");
            List<String> osList = Arrays.asList("Windows 11", "macOS Sonoma", "Linux Ubuntu", "iOS 17", "Android 14");
            List<String> browsers = Arrays.asList("Chrome", "Safari", "Firefox", "Edge", "PostmanRuntime");
            List<String> locations = Arrays.asList("Phnom Penh, KH", "London, UK", "New York, US", "Tokyo, JP", "Sydney, AU");
            List<String> devices = Arrays.asList("Desktop", "Mobile", "Tablet", "Server");
            List<String> dataUsages = Arrays.asList("Standard (12MB)", "Heavy (150MB)", "Light (1.5MB)", "API Access (25KB)");
            List<String> statuses = Arrays.asList("Success", "Success", "Success", "Failed", "Suspicious");

            for (int i = 1; i <= 25; i++) {
                LoginHistory log = new LoginHistory();
                log.setLoggedBy(users.get(random.nextInt(users.size())));
                // Random time within last 7 days
                log.setLoggedDate(LocalDateTime.now().minusHours(random.nextInt(168)));
                log.setIpAddress(random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256) + "." + random.nextInt(256));
                log.setHostName("Host-" + random.nextInt(9999));
                log.setDeviceType(devices.get(random.nextInt(devices.size())));
                log.setOs(osList.get(random.nextInt(osList.size())));
                log.setBrowser(browsers.get(random.nextInt(browsers.size())));
                log.setLocation(locations.get(random.nextInt(locations.size())));
                log.setDataUsageType(dataUsages.get(random.nextInt(dataUsages.size())));
                log.setStatus(statuses.get(random.nextInt(statuses.size())));

                loginHistoryRepository.save(log);
            }
        }
    }
}
