package com.mtp.api.repositories;

import com.mtp.api.models.JobExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobExperienceRepository extends JpaRepository<JobExperience, Integer> {
    List<JobExperience> findByClientId(Integer clientId);
}
