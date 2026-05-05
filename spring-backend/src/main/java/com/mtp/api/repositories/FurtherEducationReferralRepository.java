package com.mtp.api.repositories;

import com.mtp.api.models.FurtherEducationReferral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FurtherEducationReferralRepository extends JpaRepository<FurtherEducationReferral, Integer> {
    List<FurtherEducationReferral> findByClientId(Integer clientId);
}
