package com.mtp.api.repositories;

import com.mtp.api.models.FuturesTraining;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FuturesTrainingRepository extends JpaRepository<FuturesTraining, Integer> {
    List<FuturesTraining> findByClientId(Integer clientId);
}
