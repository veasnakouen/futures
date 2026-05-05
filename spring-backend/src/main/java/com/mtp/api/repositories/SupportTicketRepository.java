package com.mtp.api.repositories;

import com.mtp.api.models.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByStatus(String status);
    List<SupportTicket> findByReporterId(String reporterId);
    List<SupportTicket> findByAssigneeId(String assigneeId);
}
