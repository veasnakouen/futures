package com.mtp.stock.repositories;

import com.mtp.stock.models.AssetCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AssetConditionRepository extends JpaRepository<AssetCondition, Integer> {
    Optional<AssetCondition> findByName(String name);
}
