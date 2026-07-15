package com.mtp.pos.repositories;

import com.mtp.pos.models.PosProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PosProductRepository extends JpaRepository<PosProduct, String> {
    @Query("SELECT MAX(p.sku) FROM PosProduct p WHERE p.sku LIKE CONCAT(:prefix, '%')")
    String findMaxSkuByPrefix(@Param("prefix") String prefix);
}
