package com.mtp.api.repositories;

import com.mtp.api.models.OnboardingTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OnboardingTaskRepository extends JpaRepository<OnboardingTask, Integer> {
}
