package com.mtp.stock.repositories;

import com.mtp.stock.models.ITAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITAssessmentRepository extends JpaRepository<ITAssessment, Long> {
}
