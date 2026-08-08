package com.mtp.stock.repositories;

import com.mtp.stock.models.ProcurementRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcurementRequestRepository extends JpaRepository<ProcurementRequest, Long> {
}
