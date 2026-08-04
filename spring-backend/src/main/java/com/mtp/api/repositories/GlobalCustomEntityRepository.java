package com.mtp.api.repositories;

import com.mtp.api.models.GlobalCustomEntityDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GlobalCustomEntityRepository extends JpaRepository<GlobalCustomEntityDefinition, String> {
    Optional<GlobalCustomEntityDefinition> findByEntityKey(String entityKey);
    List<GlobalCustomEntityDefinition> findAllByOrderByCreatedAtDesc();
}
