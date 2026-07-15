package com.mtp.api.repositories;

import com.mtp.api.models.OnboardingChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OnboardingChecklistRepository extends JpaRepository<OnboardingChecklist, Integer> {
    Optional<OnboardingChecklist> findByEmployeeId(Integer employeeId);
}
