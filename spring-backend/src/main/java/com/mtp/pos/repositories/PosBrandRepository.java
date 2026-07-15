package com.mtp.pos.repositories;

import com.mtp.pos.models.PosBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PosBrandRepository extends JpaRepository<PosBrand, String> {
}
