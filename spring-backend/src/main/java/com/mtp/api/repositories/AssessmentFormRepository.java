package com.mtp.api.repositories;

import com.mtp.api.models.AssessmentForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentFormRepository extends JpaRepository<AssessmentForm, Long> {
    List<AssessmentForm> findByTicketId(String ticketId);
}
