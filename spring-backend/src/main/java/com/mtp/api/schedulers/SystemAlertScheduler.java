package com.mtp.api.schedulers;

import com.mtp.api.models.Employee;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.models.User;
import com.mtp.api.models.Role;
import com.mtp.api.repositories.UserRepository;
import com.mtp.api.services.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class SystemAlertScheduler {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Runs every day at 8:00 AM to check for employees whose probation ends in exactly 5 days.
     * We notify all users who have the HR role.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void notifyProbationEndingSoon() {
        log.info("Running SystemAlertScheduler to check for probation endings...");
        
        LocalDate targetDate = LocalDate.now().plusDays(5);
        List<Employee> endingSoon = employeeRepository.findByProbationEndDate(targetDate);
        
        if (endingSoon.isEmpty()) {
            log.info("Completed probation ending check. No employees found ending probation on {}", targetDate);
            return;
        }

        // Fetch all users to filter those with the HR role.
        // Assuming roles are fetched eagerly as defined in User.java
        List<User> hrUsers = userRepository.findAll().stream()
            .filter(user -> user.getRoles().stream()
                .anyMatch(role -> "HR".equalsIgnoreCase(role.getName()) || "ADMIN".equalsIgnoreCase(role.getName())))
            .collect(Collectors.toList());

        if (hrUsers.isEmpty()) {
            log.warn("No users with HR or ADMIN role found to receive probation alerts.");
        }

        for (Employee emp : endingSoon) {
            String title = "Probation Ending Soon";
            String message = String.format("Employee %s %s (ID: %s) probation ends in 5 days on %s.", 
                    emp.getFirstNameEnglish(), emp.getLastNameEnglish(), emp.getIdNo(), targetDate.toString());
            
            for (User hrUser : hrUsers) {
                notificationService.sendNotification(hrUser.getUserName(), title, message, "PROBATION_ALERT");
            }
            log.info("Sent probation alert for employee ID: {} to {} users.", emp.getIdNo(), hrUsers.size());
        }
        
        log.info("Completed probation ending check. Found {} employees.", endingSoon.size());
    }
}
