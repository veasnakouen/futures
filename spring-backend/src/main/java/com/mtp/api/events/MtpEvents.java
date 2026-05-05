package com.mtp.api.events;

/**
 * Domain events for the MTP system.
 * These are published via ApplicationEventPublisher and consumed by listeners
 * in separate services — completely decoupled from the controller layer.
 */
public class MtpEvents {

    /** Fired after a new client is registered */
    public record ClientRegisteredEvent(Integer clientId, String clientCode, String fullName, String branch) {
    }

    /** Fired after a new employee is onboarded */
    public record EmployeeOnboardedEvent(Integer employeeId, String name, String department, String email) {
    }

    /** Fired after a new job placement is recorded */
    public record PlacementRecordedEvent(Integer placementId, String clientName, String companyName, Double salary) {
    }

    /** Fired after an employer is linked to a vacancy */
    public record VacancyPublishedEvent(Integer vacancyId, String employerName, String position) {
    }

    /** Fired when a user logs in (for audit logging) */
    public record UserLoginEvent(String username, String ipAddress, java.time.LocalDateTime loginTime) {
    }
}
