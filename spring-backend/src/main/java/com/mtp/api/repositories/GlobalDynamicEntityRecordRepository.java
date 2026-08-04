package com.mtp.api.repositories;

import com.mtp.api.models.GlobalDynamicEntityRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlobalDynamicEntityRecordRepository extends JpaRepository<GlobalDynamicEntityRecord, String> {
    List<GlobalDynamicEntityRecord> findByEntityKeyOrderByCreatedAtDesc(String entityKey);
}
