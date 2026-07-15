package com.mtp.stock.repositories;

import com.mtp.stock.models.AssetBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AssetBrandRepository extends JpaRepository<AssetBrand, Integer> {
    Optional<AssetBrand> findByName(String name);
}
