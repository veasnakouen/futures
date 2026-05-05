package com.mtp.api.repositories;

import com.mtp.api.models.EducationReferralSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationReferralSourceRepository extends JpaRepository<EducationReferralSource, Integer> {
}
