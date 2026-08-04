package com.mtp.api.repositories;

import com.mtp.api.models.GlobalEntityRelationshipDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlobalEntityRelationshipRepository extends JpaRepository<GlobalEntityRelationshipDefinition, String> {
    List<GlobalEntityRelationshipDefinition> findBySourceEntityKey(String sourceEntityKey);
    List<GlobalEntityRelationshipDefinition> findByTargetEntityKey(String targetEntityKey);
}
