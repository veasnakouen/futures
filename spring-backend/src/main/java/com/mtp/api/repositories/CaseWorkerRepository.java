package com.mtp.api.repositories;

import com.mtp.api.models.CaseWorker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseWorkerRepository extends JpaRepository<CaseWorker, Integer> {
}
