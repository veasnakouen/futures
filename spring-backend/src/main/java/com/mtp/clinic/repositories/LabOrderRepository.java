package com.mtp.clinic.repositories;

import com.mtp.clinic.models.LabOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabOrderRepository extends JpaRepository<LabOrder, String> {
}
