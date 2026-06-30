package com.mtp.api.repositories;

import com.mtp.api.models.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByStatus(String status);

    List<SupportTicket> findByReporterId(String reporterId);

    List<SupportTicket> findByAssignees_Id(String assigneeId);

    List<SupportTicket> findByStatusAndResolvedAtBefore(String status, java.time.LocalDateTime dateTime);

    @org.springframework.data.jpa.repository.Query("SELECT a.firstName, a.lastName, COUNT(t) FROM SupportTicket t JOIN t.assignees a GROUP BY a.firstName, a.lastName")
    List<Object[]> countTicketsPerAssignee();
}
