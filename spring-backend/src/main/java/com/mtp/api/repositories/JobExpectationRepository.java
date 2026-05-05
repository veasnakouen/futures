package com.mtp.api.repositories;

import com.mtp.api.models.JobExpectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobExpectationRepository extends JpaRepository<JobExpectation, Integer> {
    List<JobExpectation> findByClientId(Integer clientId);
}
