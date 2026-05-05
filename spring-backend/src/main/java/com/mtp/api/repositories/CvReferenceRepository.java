package com.mtp.api.repositories;

import com.mtp.api.models.CvReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CvReferenceRepository extends JpaRepository<CvReference, Integer> {
    List<CvReference> findByClientId(Integer clientId);
}
