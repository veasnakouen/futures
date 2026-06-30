package com.mtp.api.repositories;

import com.mtp.api.models.Case;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface CaseRepository extends JpaRepository<Case, Integer> {
    @EntityGraph(attributePaths = {"client", "caseWorker"})
    List<Case> findByClientId(Integer clientId);

    @EntityGraph(attributePaths = {"client", "caseWorker"})
    Page<Case> findByStatus(String status, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"client", "caseWorker"})
    Page<Case> findAll(Pageable pageable);
}
