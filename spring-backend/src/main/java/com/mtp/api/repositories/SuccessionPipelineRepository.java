package com.mtp.api.repositories;

import com.mtp.api.models.SuccessionPipeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuccessionPipelineRepository extends JpaRepository<SuccessionPipeline, Integer> {
    List<SuccessionPipeline> findByIsCoveredFalse();
}
