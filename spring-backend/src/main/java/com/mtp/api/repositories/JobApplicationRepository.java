package com.mtp.api.repositories;

import com.mtp.api.models.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    Page<JobApplication> findByVacancyId(Integer vacancyId, Pageable pageable);
    Page<JobApplication> findByClientId(Integer clientId, Pageable pageable);
    Page<JobApplication> findByVacancy_EmployerId(Integer employerId, Pageable pageable);
}
