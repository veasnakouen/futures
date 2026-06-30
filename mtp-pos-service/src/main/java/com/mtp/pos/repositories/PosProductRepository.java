package com.mtp.pos.repositories;

import com.mtp.pos.models.PosProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosProductRepository extends JpaRepository<PosProduct, String> {
}
