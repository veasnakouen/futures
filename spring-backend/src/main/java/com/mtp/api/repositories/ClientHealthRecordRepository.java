package com.mtp.api.repositories;

import com.mtp.api.models.ClientHealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientHealthRecordRepository extends JpaRepository<ClientHealthRecord, Long> {
    List<ClientHealthRecord> findByClientId(Long clientId);
}
