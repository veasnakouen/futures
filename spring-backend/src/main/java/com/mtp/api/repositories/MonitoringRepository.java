package com.mtp.api.repositories;

import com.mtp.api.models.Monitoring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MonitoringRepository extends JpaRepository<Monitoring, Integer> {
    List<Monitoring> findByClientId(Integer clientId);
}
