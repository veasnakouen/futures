package com.mtp.api.repositories;

import com.mtp.api.models.Commune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommuneRepository extends JpaRepository<Commune, Integer> {
    List<Commune> findByDistrictId(Integer districtId);
}
