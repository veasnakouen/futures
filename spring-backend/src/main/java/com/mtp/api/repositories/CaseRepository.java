package com.mtp.api.repositories;

import com.mtp.api.models.Case;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaseRepository extends JpaRepository<Case, Integer> {
    List<Case> findByClientId(Integer clientId);
    Page<Case> findByStatus(String status, Pageable pageable);
}
