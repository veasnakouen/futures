package com.mtp.clinic.repositories;

import com.mtp.clinic.models.CustomFieldDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("clinicCustomFieldDefinitionRepository")
public interface CustomFieldDefinitionRepository extends JpaRepository<CustomFieldDefinition, String> {
    List<CustomFieldDefinition> findByEntityType(String entityType);
}
