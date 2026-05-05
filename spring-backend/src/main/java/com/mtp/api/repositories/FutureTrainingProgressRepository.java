package com.mtp.api.repositories;

import com.mtp.api.models.FutureTrainingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FutureTrainingProgressRepository extends JpaRepository<FutureTrainingProgress, Integer> {
    List<FutureTrainingProgress> findByMonitoringId(Integer monitoringId);
}
