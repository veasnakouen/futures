package com.mtp.api.repositories;

import com.mtp.api.models.BusinessInProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusinessInProgressRepository extends JpaRepository<BusinessInProgress, Integer> {
    List<BusinessInProgress> findByMonitoringId(Integer monitoringId);
}
