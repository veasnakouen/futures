package com.mtp.auth.repositories;

import com.mtp.auth.models.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Integer> {

    @Modifying
    @Transactional
    void deleteByLoggedDateBefore(LocalDateTime date);

    @Modifying
    @Transactional
    void deleteByStatus(String status);
}
