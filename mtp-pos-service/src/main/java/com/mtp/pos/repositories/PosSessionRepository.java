package com.mtp.pos.repositories;

import com.mtp.pos.models.PosSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosSessionRepository extends JpaRepository<PosSession, String> {
}
