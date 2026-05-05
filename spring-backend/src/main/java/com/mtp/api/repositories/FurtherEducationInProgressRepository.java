package com.mtp.api.repositories;

import com.mtp.api.models.FurtherEducationInProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FurtherEducationInProgressRepository extends JpaRepository<FurtherEducationInProgress, Integer> {
    List<FurtherEducationInProgress> findByMonitoringId(Integer monitoringId);
}
