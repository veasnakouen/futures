package com.mtp.pos.repositories;

import com.mtp.pos.models.PosSale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PosSaleRepository extends JpaRepository<PosSale, String> {
    Optional<PosSale> findByIdempotencyKey(String idempotencyKey);
}
