package com.mtp.api.repositories;

import com.mtp.api.models.FurtherEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FurtherEducationRepository extends JpaRepository<FurtherEducation, Integer> {
    List<FurtherEducation> findByClientId(Integer clientId);
}
