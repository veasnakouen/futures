package com.mtp.pos.repositories;

import com.mtp.pos.models.PosSale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosSaleRepository extends JpaRepository<PosSale, String> {
}
