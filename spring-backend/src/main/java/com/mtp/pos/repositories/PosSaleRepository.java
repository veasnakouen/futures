package com.mtp.pos.repositories;

import com.mtp.pos.models.PosSale;
import org.springframework.data.jpa.repository.JpaRepository;

// import org.springframework.stereotype.Repository;
// import java.util.List;

import java.util.Optional;

public interface PosSaleRepository extends JpaRepository<PosSale, String> {
    // find-one
    Optional<PosSale> findByIdempotencyKey(String idempotencyKey);
}
// @Repository
// public interface PosListRepository extends JpaRepository<PosSale, String> {
// List<PosSale> findByAll();
// }
