package com.mtp.api.repositories;

import com.mtp.api.models.PlacementCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlacementCategoryRepository extends JpaRepository<PlacementCategory, Integer> {
    Optional<PlacementCategory> findByName(String name);
}
