package com.mtp.pos.repositories;

import com.mtp.pos.models.PosCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosCategoryRepository extends JpaRepository<PosCategory, String> {
}
