package com.mtp.school.repositories;

import com.mtp.school.models.ReferralCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralCaseRepository extends JpaRepository<ReferralCase, String> {
    List<ReferralCase> findByTenantIdAndStudentId(String tenantId, String studentId);
    List<ReferralCase> findByTenantId(String tenantId);
}
