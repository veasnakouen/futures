package com.mtp.api.repositories;

import com.mtp.api.models.Placement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlacementRepository extends JpaRepository<Placement, Integer> {
    List<Placement> findByClientId(Integer clientId);
    Page<Placement> findByCompanyNameContainingOrPlacementTypeContaining(String companyName, String placementType, Pageable pageable);
}
