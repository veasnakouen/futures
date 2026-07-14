package com.mtp.api.schedulers;

import com.mtp.api.models.Employee;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.services.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@Slf4j
public class SystemAlertScheduler {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Runs every day at 8:00 AM to check for employees whose probation ends in exactly 5 days.
     * We use a fixed username "admin" as the default recipient, as requested by the current NotificationService architecture.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void notifyProbationEndingSoon() {
        log.info("Running SystemAlertScheduler to check for probation endings...");
        
        LocalDate targetDate = LocalDate.now().plusDays(5);
        List<Employee> endingSoon = employeeRepository.findByProbationEndDate(targetDate);
        
        for (Employee emp : endingSoon) {
            String title = "Probation Ending Soon";
            String message = String.format("Employee %s %s (ID: %s) probation ends in 5 days on %s.", 
                    emp.getFirstNameEnglish(), emp.getLastNameEnglish(), emp.getIdNo(), targetDate.toString());
            
            // Sending to default admin account. In a real world scenario this could be fetched from a Role repository.
            notificationService.sendNotification("admin", title, message, "PROBATION_ALERT");
            log.info("Sent probation alert for employee ID: {}", emp.getIdNo());
        }
        
        log.info("Completed probation ending check. Found {} employees.", endingSoon.size());
    }
}
