package com.mtp.api.services;

import com.mtp.api.models.GlobalCustomEntityDefinition;
import com.mtp.api.models.GlobalDynamicEntityRecord;
import com.mtp.api.models.GlobalEntityRelationshipDefinition;

import java.util.List;

public interface GlobalEntityBuilderService {
    List<GlobalCustomEntityDefinition> getAllEntities();
    GlobalCustomEntityDefinition createEntity(GlobalCustomEntityDefinition entity);
    void deleteEntity(String id);
    List<GlobalEntityRelationshipDefinition> getRelationships(String entityKey);
    GlobalEntityRelationshipDefinition createRelationship(GlobalEntityRelationshipDefinition rel);
    List<GlobalDynamicEntityRecord> getRecords(String entityKey);
    GlobalDynamicEntityRecord createRecord(String entityKey, GlobalDynamicEntityRecord record);
}
