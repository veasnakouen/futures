package com.mtp.api.repositories;

import com.mtp.api.models.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Integer> {
    List<Education> findByClientId(Integer clientId);
}
