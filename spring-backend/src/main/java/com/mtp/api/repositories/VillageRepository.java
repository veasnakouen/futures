package com.mtp.api.repositories;

import com.mtp.api.models.Village;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VillageRepository extends JpaRepository<Village, Integer> {
    List<Village> findByCommuneId(Integer communeId);
}
