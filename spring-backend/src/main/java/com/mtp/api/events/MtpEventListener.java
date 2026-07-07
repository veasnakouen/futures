package com.mtp.api.events;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

/**
 * Central event listener for all MTP domain events.
 *
 * Each handler is @Async — they run in the background thread pool
 * (defined in AsyncConfig) and NEVER block the HTTP response.
 *
 * Real-time push: events are forwarded to the WebSocket topic
 * /topic/notifications so the React frontend can receive live updates.
 */
@Component
@Slf4j
public class MtpEventListener {

    @Autowired(required = false) // Optional — graceful if WebSocket not configured
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    @Async("asyncExecutor")
    public void onClientRegistered(MtpEvents.ClientRegisteredEvent event) {
        log.info("EVENT: New client registered | code={} name={} branch={}",
                event.clientCode(), event.fullName(), event.branch());

        // Push live notification to all connected React clients
        pushNotification("CLIENT_REGISTERED",
                "New client registered: " + event.fullName() + " (" + event.clientCode() + ")");
    }

    @EventListener
    @Async("asyncExecutor")
    public void onEmployeeOnboarded(MtpEvents.EmployeeOnboardedEvent event) {
        log.info("EVENT: New employee onboarded | name={} dept={}",
                event.name(), event.department());

        pushNotification("EMPLOYEE_ONBOARDED",
                "Staff onboarded: " + event.name() + " — " + event.department());
    }

    @EventListener
    @Async("asyncExecutor")
    public void onPlacementRecorded(MtpEvents.PlacementRecordedEvent event) {
        log.info("EVENT: Placement recorded | client={} company={} salary=${}",
                event.clientName(), event.companyName(), event.salary());

        pushNotification("PLACEMENT_RECORDED",
                event.clientName() + " placed at " + event.companyName());
    }

    @EventListener
    @Async("asyncExecutor")
    public void onVacancyPublished(MtpEvents.VacancyPublishedEvent event) {
        log.info("EVENT: Vacancy published | employer={} position={}",
                event.employerName(), event.position());

        pushNotification("VACANCY_PUBLISHED",
                "New vacancy: " + event.position() + " at " + event.employerName());
    }

    @EventListener
    @Async("asyncExecutor")
    public void onUserLogin(MtpEvents.UserLoginEvent event) {
        // Audit log — never push login events to WebSocket (security)
        log.info("AUDIT: User login | user={} ip={} time={}",
                event.username(), event.ipAddress(), event.loginTime());
    }

    /**
     * Pushes a notification payload to all subscribed WebSocket clients.
     * React frontend subscribes via: stompClient.subscribe('/topic/notifications',
     * handler)
     */
    private void pushNotification(String type, String message) {
        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSend("/topic/notifications", Map.of(
                        "type", type,
                        "message", message,
                        "timestamp", java.time.LocalDateTime.now().toString()));
            } catch (Exception e) {
                log.warn("WebSocket push failed (non-critical): {}", e.getMessage());
            }
        }
    }
}
