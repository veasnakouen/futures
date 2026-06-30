package com.mtp.stock.repositories;

import com.mtp.stock.models.AssetSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AssetSupplierRepository extends JpaRepository<AssetSupplier, Integer> {
    Optional<AssetSupplier> findByName(String name);
}
