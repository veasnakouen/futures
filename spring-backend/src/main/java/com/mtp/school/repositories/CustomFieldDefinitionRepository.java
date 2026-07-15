package com.mtp.school.repositories;

import com.mtp.school.models.CustomFieldDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("schoolCustomFieldDefinitionRepository")
public interface CustomFieldDefinitionRepository extends JpaRepository<CustomFieldDefinition, String> {
    List<CustomFieldDefinition> findByEntityType(String entityType);
}
