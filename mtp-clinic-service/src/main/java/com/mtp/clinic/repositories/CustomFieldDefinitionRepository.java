package com.mtp.clinic.repositories;

import com.mtp.clinic.models.CustomFieldDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomFieldDefinitionRepository extends JpaRepository<CustomFieldDefinition, String> {
    List<CustomFieldDefinition> findByEntityType(String entityType);
}
