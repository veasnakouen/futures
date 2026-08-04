package com.mtp.api.services.impl;

import com.mtp.api.models.GlobalCustomEntityDefinition;
import com.mtp.api.models.GlobalDynamicEntityRecord;
import com.mtp.api.models.GlobalEntityRelationshipDefinition;
import com.mtp.api.repositories.GlobalCustomEntityRepository;
import com.mtp.api.repositories.GlobalDynamicEntityRecordRepository;
import com.mtp.api.repositories.GlobalEntityRelationshipRepository;
import com.mtp.api.services.GlobalEntityBuilderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GlobalEntityBuilderServiceImpl implements GlobalEntityBuilderService {

    private final GlobalCustomEntityRepository entityRepository;
    private final GlobalEntityRelationshipRepository relationshipRepository;
    private final GlobalDynamicEntityRecordRepository recordRepository;

    @Override
    public List<GlobalCustomEntityDefinition> getAllEntities() {
        return entityRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public GlobalCustomEntityDefinition createEntity(GlobalCustomEntityDefinition entity) {
        if (entity.getEntityKey() != null) {
            entity.setEntityKey(entity.getEntityKey().toUpperCase().replaceAll("[^A-Z0-9_]", "_"));
        }
        return entityRepository.save(entity);
    }

    @Override
    @Transactional
    public void deleteEntity(String id) {
        entityRepository.deleteById(id);
    }

    @Override
    public List<GlobalEntityRelationshipDefinition> getRelationships(String entityKey) {
        return relationshipRepository.findBySourceEntityKey(entityKey);
    }

    @Override
    @Transactional
    public GlobalEntityRelationshipDefinition createRelationship(GlobalEntityRelationshipDefinition rel) {
        return relationshipRepository.save(rel);
    }

    @Override
    public List<GlobalDynamicEntityRecord> getRecords(String entityKey) {
        return recordRepository.findByEntityKeyOrderByCreatedAtDesc(entityKey);
    }

    @Override
    @Transactional
    public GlobalDynamicEntityRecord createRecord(String entityKey, GlobalDynamicEntityRecord record) {
        record.setEntityKey(entityKey);
        if (record.getRecordCode() == null || record.getRecordCode().isEmpty()) {
            record.setRecordCode("REC-" + System.currentTimeMillis() % 100000);
        }
        return recordRepository.save(record);
    }
}
