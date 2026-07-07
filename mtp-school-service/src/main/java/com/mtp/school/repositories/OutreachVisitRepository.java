package com.mtp.school.repositories;

import com.mtp.school.models.OutreachVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutreachVisitRepository extends JpaRepository<OutreachVisit, String> {
    List<OutreachVisit> findByTenantIdAndStudentId(String tenantId, String studentId);
    List<OutreachVisit> findByTenantId(String tenantId);
}
