package com.mtp.api.repositories;

import com.mtp.api.models.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByUserId(String userId);
    Optional<Connection> findByUserIdAndTargetIdAndTargetType(String userId, String targetId, String targetType);
    boolean existsByUserIdAndTargetIdAndTargetType(String userId, String targetId, String targetType);
    void deleteByUserIdAndTargetIdAndTargetType(String userId, String targetId, String targetType);
}
