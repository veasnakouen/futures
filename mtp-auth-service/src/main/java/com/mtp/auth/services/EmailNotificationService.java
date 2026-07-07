package com.mtp.auth.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    public void sendSuspensionEmail(String to, String tenantName) {
        if (to == null)
            return;
        log.info("==================================================");
        log.info("📧 MOCK EMAIL DISPATCH: SUSPENSION NOTICE");
        log.info("TO: {}", to);
        log.info("SUBJECT: Action Required: Your organization {} has been suspended", tenantName);
        log.info("BODY:");
        log.info("Dear Administrator,\n");
        log.info(
                "Your subscription for {} has expired. As a result, your organization's access has been temporarily suspended.",
                tenantName);
        log.info("Please renew your subscription immediately to restore access.");
        log.info("==================================================");
    }

    public void sendWarningEmail(String to, String tenantName, int daysRemaining) {
        if (to == null)
            return;
        log.info("==================================================");
        log.info("📧 MOCK EMAIL DISPATCH: RENEWAL REMINDER ({} Days)", daysRemaining);
        log.info("TO: {}", to);
        log.info("SUBJECT: Reminder: Your subscription for {} expires in {} days", tenantName, daysRemaining);
        log.info("BODY:");
        log.info("Dear Administrator,\n");
        log.info("This is an automated reminder that your subscription for {} will expire in {} days.", tenantName,
                daysRemaining);
        log.info("Please ensure payment is made before the deadline to avoid service interruption.");
        log.info("==================================================");
    }
}
