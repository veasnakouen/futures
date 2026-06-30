package com.mtp.stock.repositories;

import com.mtp.stock.models.AssetDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AssetDonorRepository extends JpaRepository<AssetDonor, Integer> {
    Optional<AssetDonor> findByName(String name);
}
