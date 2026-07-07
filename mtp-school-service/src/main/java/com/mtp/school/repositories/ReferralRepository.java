package com.mtp.school.repositories;

import com.mtp.school.models.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, String> {
    List<Referral> findByTenantId(String tenantId);
    List<Referral> findByTenantIdAndReferralCaseId(String tenantId, String referralCaseId);
    List<Referral> findByTenantIdAndDepartmentIdIn(String tenantId, List<Long> departmentIds);
}
