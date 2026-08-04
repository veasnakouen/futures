package com.mtp.api.repositories;

import com.mtp.api.models.GlobalCustomFieldDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GlobalCustomFieldRepository extends JpaRepository<GlobalCustomFieldDefinition, String> {

    List<GlobalCustomFieldDefinition> findByEntityTypeOrderByCreatedAtDesc(String entityType);

    Optional<GlobalCustomFieldDefinition> findByEntityTypeAndFieldKey(String entityType, String fieldKey);
}
