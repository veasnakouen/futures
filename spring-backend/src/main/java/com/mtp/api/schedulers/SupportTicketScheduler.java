package com.mtp.api.schedulers;

import com.mtp.api.models.SupportTicket;
import com.mtp.api.repositories.SupportTicketRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class SupportTicketScheduler {

    @Autowired
    private SupportTicketRepository ticketRepository;

    /**
     * Runs every hour to check for Resolved tickets that are older than 24 hours.
     * Marks them as Closed automatically.
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour on the hour
    public void autoCloseResolvedTickets() {
        log.info("Running SupportTicketScheduler to auto-close resolved tickets...");
        
        List<SupportTicket> resolvedTickets = ticketRepository.findByStatus("Resolved");
        LocalDateTime thresholdTime = LocalDateTime.now().minusHours(24);
        
        int closedCount = 0;
        for (SupportTicket ticket : resolvedTickets) {
            LocalDateTime resolvedAt = ticket.getResolvedAt();
            // Fallback to createdAt if resolvedAt is missing for some reason
            if (resolvedAt == null) {
                resolvedAt = ticket.getCreatedAt();
            }
            
            if (resolvedAt != null && resolvedAt.isBefore(thresholdTime)) {
                ticket.setStatus("Closed");
                ticketRepository.save(ticket);
                closedCount++;
                log.info("Auto-closed ticket ID: {}", ticket.getId());
            }
        }
        
        if (closedCount > 0) {
            log.info("Successfully auto-closed {} tickets.", closedCount);
        }
    }
}
